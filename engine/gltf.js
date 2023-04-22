/* gltf.js - glTF asset loading.
 * Written by quadfault
 * 4/13/23
 */

import { Attribute } from './attribute.js'
import { Buffer } from './buffer.js'
import { Camera } from './camera.js'
import { DirectionalLight, PointLight } from './light.js'
import { Material } from './material.js'
import { mat4, vec4 } from './math.js'
import { Mesh } from './mesh.js'
import { Node } from './node.js'
import { Primitive } from './primitive.js'
import { Scene } from './scene.js'

/* Sparse array giving the size in bytes of an accessor component from `asset.accessors[i].componentType`. */
const bytesPerComponentType = []
bytesPerComponentType[5120] = 1
bytesPerComponentType[5121] = 1
bytesPerComponentType[5122] = 2
bytesPerComponentType[5123] = 2
bytesPerComponentType[5125] = 4
bytesPerComponentType[5126] = 4

const componentsPerType = {
    'SCALAR':  1,
    'VEC2':    2,
    'VEC3':    3,
    'VEC4':    4,
    'MAT2':    4,
    'MAT3':    9,
    'MAT4':    16,
}

/* Load and return the glTF 2.0 asset located at `url`. The URL should not be relative (except protocol-relative), as
 * browsers do not have a concept of "working directory", and the URL would be interpreted relative to this file, not
 * the caller.
 *
 * The asset is fixed up a bit before being returned. In particular, all buffers are fetched and the buffer data is
 * available as an ArrayBuffer from the `data` property of each buffer.
 */
export async function loadGltfAssetAsync(url) {
    const response = await fetch(url)
    const asset = await response.json()

    /* FIXME: For now, we just assume the asset is spec-correct and has what we expect. */

    for (let buffer of asset.buffers) {
        const response = await fetch(buffer.uri)
        buffer.data = await response.arrayBuffer()
    }

    return asset
}

/* Load */
export function scenesFromAsset(ctx, asset) {
    /* Convert each glTF light into the appropriate kind of Light. */
    const lights = []
    if (asset.extensionsUsed?.includes('KHR_lights_punctual')) {
        for (let [index, lightSpec] of asset.extensions.KHR_lights_punctual.lights.entries()) {
            const color = vec4.make(...lightSpec.color, 1)

            if (lightSpec.type === 'directional')
                lights.push(new DirectionalLight(ctx, lightSpec.name, index, color))
            else if (lightSpec.type === 'point')
                lights.push(new PointLight(ctx, lightSpec.name, index, color))

            /* TODO: handle other light types */
        }
    }

    /* Convert each glTF buffer view into a Buffer. */
    const buffers = []
    for (let bufferSpec of asset.bufferViews) {
        const data = new DataView(
            asset.buffers[bufferSpec.buffer].data,
            bufferSpec.byteOffset,
            bufferSpec.byteLength)
        buffers.push(new Buffer(ctx, bufferSpec.target, data))
    }

    /* Convert each glTF material into a Material. */
    const materials = []
    for (let materialSpec of asset.materials) {
        materials.push(new Material(ctx, materialSpec.name, materialSpec.pbrMetallicRoughness.baseColorFactor))
    }

    /* Convert each glTF mesh into a Mesh. */
    const meshes = []
    for (let meshSpec of asset.meshes) {
        /* Convert each glTF primitive into a Primitive. */
        const primitives = []
        for (let primitiveSpec of meshSpec.primitives)
            primitives.push(primitiveFromSpec(ctx, asset, primitiveSpec, buffers, materials))

        meshes.push(new Mesh(ctx, meshSpec.name, primitives))
    }

    /* Convert each glTF camera into a Camera. */
    const cameras = []
    for (let cameraSpec of asset.cameras) {
        let projection
        if (cameraSpec.type === 'orthographic' && cameraSpec.orthographic) {
            const ortho = cameraSpec.orthographic
            projection = mat4.orthographic(ortho.xmag, ortho.ymag, ortho.znear, ortho.zfar)
        } else if (cameraSpec.type === 'perspective' && cameraSpec.perspective) {
            const perspec = cameraSpec.perspective
            projection = mat4.perspective(perspec.aspectRatio, perspec.yfov, perspec.znear, perspec.zfar)
        } else {
            console.warn(`warning: no projection specified for camera '${cameraSpec.name}'`)
            projection = mat4.identity()
        }

        cameras.push(new Camera(ctx, cameraSpec.name, projection))
    }

    /* Convert each glTF scene into a Scene, converting each glTF node into a Node along the way. */
    const scenes = []
    for (let sceneSpec of asset.scenes) {
        const sceneNodes = []
        for (let nodeIndex of sceneSpec.nodes)
            sceneNodes.push(nodeFromSpec(ctx, asset, nodeIndex, cameras, meshes, lights))

        scenes.push(new Scene(ctx, sceneSpec.name, sceneNodes))
    }

    return [scenes, asset.scene]
}

function primitiveFromSpec(ctx, asset, primitiveSpec, buffers, materials) {
    const gl = ctx.gl

    const mode = primitiveSpec.hasOwnProperty('mode') ? primitiveSpec.mode : gl.TRIANGLES
    const material = materials[primitiveSpec.material]

    const positionAttr = makeAttribute(ctx, 'a_Position', asset.accessors[primitiveSpec.attributes.POSITION], buffers)
    const normalAttr = makeAttribute(ctx, 'a_Normal', asset.accessors[primitiveSpec.attributes.NORMAL], buffers)
    
    let indexBuffer, indexCount, indexType, indexOffset
    if (primitiveSpec.hasOwnProperty('indices')) {
        const indexAccessor = asset.accessors[primitiveSpec.indices]
        indexBuffer = buffers[indexAccessor.bufferView]
        indexCount = indexAccessor.count
        indexType = indexAccessor.componentType
        indexOffset = indexAccessor.byteOffset || 0
    }

    return new Primitive(
        ctx,
        mode,
        positionAttr,
        normalAttr,
        material,
        indexBuffer,
        indexCount,
        indexType,
        indexOffset)
}

function makeAttribute(ctx, name, accessorSpec, buffers) {
    const buffer = buffers[accessorSpec.bufferView]
    const size = componentsPerType[accessorSpec.type]
    const type = accessorSpec.componentType
    const stride = 0
    const offset = accessorSpec.byteOffset || 0

    return new Attribute(ctx, buffer, name, size, type, stride, offset)
}

function nodeFromSpec(ctx, asset, nodeIndex, cameras, meshes, lights) {
    const nodeSpec = asset.nodes[nodeIndex]

    const transform = nodeSpec.matrix ||
        mat4
            .scale_v(nodeSpec.scale || [1, 1, 1])
            .rotate_v(nodeSpec.rotation || [0, 0, 0, 1])
            .translate_v(nodeSpec.translation || [0, 0, 0])

    const children = []
    if (nodeSpec.hasOwnProperty('camera'))
        children.push(cameras[nodeSpec.camera])
    if (nodeSpec.hasOwnProperty('mesh'))
        children.push(meshes[nodeSpec.mesh])
    if (nodeSpec.hasOwnProperty('extensions')) {
        if (nodeSpec.extensions.hasOwnProperty('KHR_lights_punctual'))
            children.push(lights[nodeSpec.extensions.KHR_lights_punctual.light])
    }
    if (nodeSpec.hasOwnProperty('children'))
        for (let childIndex of nodeSpec.children)
            children.push(nodeFromSpec(ctx, asset, childIndex, cameras, meshes))

    return new Node(ctx, nodeSpec.name, transform, children, [])
}
