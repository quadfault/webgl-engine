/* spin.js - Spinning triangles.
 * Written by quadfault
 * 2/27/23
 */

import { Renderer, mat4 } from './engine.js'

/* BEGIN main */

const scaleTransform = mat4.scale(0.2, 0.2, 0.2)

const canvas = document.querySelector('canvas')
const renderer = Renderer.begin(canvas)
    .scene('Spinning Triangles')
        .node('root node')
            .camera()
                .projection(mat4.orthographic(1, 1, 0, 1))
            .end()
            .on('update', spinBy(20))
            .node('scale node 1')
                .transform(scaleTransform)
                .node('triangle node 1')
                    .on('update', spinBy(60))
                    .triangle()
                        .vertex()
                            .position(0, 1, 0)
                            .color(1, 0, 0, 1)
                        .end()
                        .vertex()
                            .position(cosa(210), sina(210), 0)
                            .color(0, 1, 0, 1)
                        .end()
                        .vertex()
                            .position(cosa(330), sina(330), 0)
                            .color(0, 0, 1, 1)
                        .end()
                    .end()
                .end()
            .end()
            .node('scale node 2')
                .transform(scaleTransform.translate(0, 0.5, 0))
                .node('triangle node 2')
                    .on('update', spinBy(100))
                    .triangle()
                        .vertex()
                            .position(0, 1, 0)
                            .color(1, 0, 0, 1)
                        .end()
                        .vertex()
                            .position(cosa(210), sina(210), 0)
                            .color(0, 1, 0, 1)
                        .end()
                        .vertex()
                            .position(cosa(330), sina(330), 0)
                            .color(0, 0, 1, 1)
                        .end()
                    .end()
                .end()
            .end()
            .node('scale node 3')
                .transform(scaleTransform.translate(0.5 * cosa(210), 0.5 * sina(210), 0))
                .node('triangle node 3')
                    .on('update', spinBy(140))
                    .triangle()
                        .vertex()
                            .position(0, 1, 0)
                            .color(1, 0, 0, 1)
                        .end()
                        .vertex()
                            .position(cosa(210), sina(210), 0)
                            .color(0, 1, 0, 1)
                        .end()
                        .vertex()
                            .position(cosa(330), sina(330), 0)
                            .color(0, 0, 1, 1)
                        .end()
                    .end()
                .end()
            .end()
            .node('scale node 4')
                .transform(scaleTransform.translate(0.5 * cosa(330), 0.5 * sina(330), 0))
                .node('triangle node 4')
                    .on('update', spinBy(180))
                    .triangle()
                        .vertex()
                            .position(0, 1, 0)
                            .color(1, 0, 0, 1)
                        .end()
                        .vertex()
                            .position(cosa(210), sina(210), 0)
                            .color(0, 1, 0, 1)
                        .end()
                        .vertex()
                            .position(cosa(330), sina(330), 0)
                            .color(0, 0, 1, 1)
                        .end()
                    .end()
                .end()
            .end()
        .end()
    .end()
.end()

renderer.animate()

/* END main */

/* Spin a node by 'angle' degrees per second. */
function spinBy(angle) {
    return (node, delta) => {
        node.transform = mat4.rotate_z(angle / 1000 * delta).times(node.transform)
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
