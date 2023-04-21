/* scene.js - Scenes.
 * Written by quadfault
 * 2/26/23
 */

import { Builder } from './builder.js'
import { Context } from './context.js'
import { GOURAUD_VS } from './gouraud-vs.js'
import { GOURAUD_FS } from './gouraud-fs.js'
import { EngineError } from './error.js'
import { vec4 } from './math.js'
import { NodeBuilder } from './node.js'

/* A collection of nodes. */
export class Scene {
    /* The rendering context. */
    #ctx

    /* The name of this scene. */
    #name

    /* The collection of nodes. */
    #nodes

    /* The color of the ambient light in the scene. */
    #ambientColor = vec4.make(0, 0, 0, 1)

    /* Construct a new scene with the given optional name and list of nodes. */
    constructor(ctx, name, nodes) {
        this.#ctx = ctx
        this.#name = name
        this.#nodes = nodes

        this.loadShaders(GOURAUD_VS, GOURAUD_FS)
    }

    /* Set or get the ambient light color of this scene. */
    ambientColor(r, g, b, a) {
        if (r) {
            this.#ambientColor = vec4.make(r, g, b, a)
            return this
        }

        return this.#ambientColor
    }

    select(name) {
        if (this.#name === name)
            return this

        for (let node of this.#nodes) {
            const result = node.select(name)
            if (result)
                return result
        }

        return null
    }

    update(delta) {
        for (let node of this.#nodes)
            node.update(delta)
    }

    /* Render the scene. */
    render() {
        const gl = this.#ctx.gl
        const attrs = this.#ctx.attrs

        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform4fv(attrs.u_AmbientColor, this.#ambientColor.asArray())

        /* Render each node. Each node will return a list of (prepared) meshes that are ready to render. We need to
         * render the meshes after all other objects so that things like cameras and lights are fully prepared and
         * can be used in the shaders.
         */
        let meshes = []
        for (let node of this.#nodes)
            meshes.push(...node.prepare())

        for (let mesh of meshes)
            mesh.render()
    }

    /* PRIVATE */

    loadShaders(vsSrc, fsSrc) {
        const gl = this.#ctx.gl

        const vs = this.compileShader(gl.VERTEX_SHADER, vsSrc)
        const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSrc)

        const program = gl.createProgram()
        if (!program)
            throw new EngineError('failed to create shader program object')

        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(program)
            gl.deleteProgram(program)
            throw new EngineError(`shader program linking failed: ${log}`)
        }

        gl.useProgram(program)

        this.#ctx.addAttr('a_Position', gl.getAttribLocation(program, 'a_Position'))
        this.#ctx.addAttr('a_Normal', gl.getAttribLocation(program, 'a_Normal'))
        this.#ctx.addAttr('u_ModelTransform', gl.getUniformLocation(program, 'u_ModelTransform'))
        this.#ctx.addAttr('u_VpTransform', gl.getUniformLocation(program, 'u_VpTransform'))
        this.#ctx.addAttr('u_NormalTransform', gl.getUniformLocation(program, 'u_NormalTransform'))
        this.#ctx.addAttr('u_Color', gl.getUniformLocation(program, 'u_Color'))
        this.#ctx.addAttr('u_AmbientColor', gl.getUniformLocation(program, 'u_AmbientColor'))
        this.#ctx.addAttr('u_LightType', gl.getUniformLocation(program, 'u_LightType'))
        this.#ctx.addAttr('u_LightPosition', gl.getUniformLocation(program, 'u_LightPosition'))
        this.#ctx.addAttr('u_LightDirection', gl.getUniformLocation(program, 'u_LightDirection'))
        this.#ctx.addAttr('u_LightColor', gl.getUniformLocation(program, 'u_LightColor'))
    }

    compileShader(type, src) {
        const gl = this.#ctx.gl

        const shader = gl.createShader(type)
        if (!shader)
            throw new EngineError('failed to create shader object')
        
        gl.shaderSource(shader, src)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader)
            gl.deleteShader(shader)
            throw new EngineError(`shader compilation failed: ${log}`)
        }

        return shader
    }
}

export class SceneBuilder extends Builder {
    #ctx
    #name
    #nodes = []

    #nodeBuilder

    constructor(parent, ctx, name) {
        super(parent)
        this.#ctx = ctx
        this.#name = name
    }

    node(name) {
        if (this.#nodeBuilder)
            this.#nodes.push(this.#nodeBuilder.build())

        this.#nodeBuilder = new NodeBuilder(this, this.#ctx, name)
        return this.#nodeBuilder
    }

    build() {
        if (this.#nodeBuilder)
            this.#nodes.push(this.#nodeBuilder.build())

        return new Scene(this.#ctx, this.#name, this.#nodes)
    }
}
