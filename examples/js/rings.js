/* rings.js - Rotating, interlocking rings.
 * Written by quadfault
 * 4/13/23
 */

import { Renderer, mat4 } from '/engine/engine.js'

/* BEGIN main */

const canvas = document.querySelector('canvas')
const renderer = new Renderer(canvas)

await renderer.loadGltfAssetAsync('/examples/assets/rings.gltf')
renderer.select('Scene')
    .ambientColor(0.1, 0.1, 0.1, 1)
renderer.select('ring-med-1')
    .on('update', ySpinBy(20))
renderer.select('ring-med-2')
    .on('update', ySpinBy(20))
renderer.select('ring-med-3')
    .on('update', ySpinBy(20))
renderer.select('ring-med-4')
    .on('update', ySpinBy(20))
renderer.select('ring-small-1')
    .on('update', ySpinBy(40))
renderer.select('ring-small-2')
    .on('update', ySpinBy(40))
renderer.select('ring-small-3')
    .on('update', ySpinBy(40))
renderer.select('ring-small-4')
    .on('update', ySpinBy(40))
renderer.select('ring-small-5')
    .on('update', ySpinBy(40))
renderer.select('ring-small-6')
    .on('update', ySpinBy(40))
renderer.select('ring-small-7')
    .on('update', ySpinBy(40))
renderer.select('ring-small-8')
    .on('update', ySpinBy(40))
renderer.select('ring-small-9')
    .on('update', ySpinBy(40))
renderer.select('ring-small-10')
    .on('update', ySpinBy(40))
renderer.select('ring-small-11')
    .on('update', ySpinBy(40))
renderer.select('ring-small-12')
    .on('update', ySpinBy(40))
renderer.select('ring-small-13')
    .on('update', ySpinBy(40))
renderer.select('ring-small-14')
    .on('update', ySpinBy(40))
renderer.select('ring-small-15')
    .on('update', ySpinBy(40))
renderer.select('ring-small-16')
    .on('update', ySpinBy(40))

renderer.animate()

/* END main */

/* Spin a node around the x-axis by 'angle' degrees per second. */
function xSpinBy(angle) {
    return (node, delta) => {
        node.transform(mat4.rotate_x(angle / 1000 * delta).times(node.transform()))
    }
}

/* Spin a node around the y-axis by 'angle' degrees per second. */
function ySpinBy(angle) {
    return (node, delta) => {
        node.transform(mat4.rotate_y(angle / 1000 * delta).times(node.transform()))
    }
}

/* Spin a node around the z-axis by 'angle' degrees per second. */
function zSpinBy(angle) {
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
