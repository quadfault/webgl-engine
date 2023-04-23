/* torus.js - Render a torus created in Blender.
 * Written by quadfault
 * 4/13/23
 */

import { Renderer, mat4 } from '/engine/engine.js'

/* BEGIN main */

const canvas = document.querySelector('canvas')
const renderer = new Renderer(canvas)

await renderer.loadGltfAssetAsync('/examples/assets/donut.gltf')
renderer.select('Scene')
    .ambientColor(0.1, 0.1, 0.1, 1)
renderer.select('donut-node')
    .on('update', spinBy(20))

renderer.animate()

/* END main */

/* Spin a node by 'angle' degrees per second. */
function spinBy(angle) {
    return (node, delta) => {
        node.transform(mat4.rotate_z(angle / 1000 * delta).times(node.transform()))
    }
}

/* Math.sin(), but accepts an angle in degrees. */
function sina(angle) {
    return Math.sin(angle * Math.PI / 180)
}

/* Math.cos(), but accepts an angle in degrees. */
function cosa(angle) {
    return Math.cos(angle * Math.PI / 180)
}
