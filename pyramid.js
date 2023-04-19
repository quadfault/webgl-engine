/* pyramid.js - Spinning pyramid.
 * Written by quadfault
 * 2/27/23
 */

import { Renderer, mat4, deg } from './engine.js'

/* BEGIN main */

let xeye = 1.8
const red = [0.8, 0.1, 0.1, 1]
const blue = [0.1, 0.8, 0.1, 1]
const green = [0.1, 0.1, 0.8, 1]
const gray = [0.4, 0.4, 0.4, 1]
const purple = [0.4, 0.4, 0.1, 1]

const canvas = document.querySelector('canvas')
const renderer = Renderer.begin(canvas)
    .scene()
        .node()
            .transform(mat4.look_at([xeye, 2.25, 2.25], [0, 0, 0], 0))
            .on('keydown', (node, ev) => {
                if (ev.keyCode == 39)
                    xeye += 0.1
                else if (ev.keyCode == 37)
                    xeye -= 0.1

                node.transform = mat4.look_at([xeye, 2.25, 2.25], [0, 0, 0], 0)
            })
            .camera()
                .projection(mat4.perspective(1, deg(30), 0.1))
            .end()
        .end()
        .node()
            .on('update', spinBy(20))
            /* Pyramid base. */
            .triangle()
                .vertex() 
                    .position(-0.5, -0.5, 0.5)
                    .color(...red)
                .end()
                .vertex()
                    .position(-0.5, -0.5, -0.5)
                    .color(...red)
                .end()
                .vertex()
                    .position(0.5, -0.5, 0.5)
                    .color(...red)
                .end()
            .end()
            .triangle()
                .vertex()
                    .position(-0.5, -0.5, -0.5)
                    .color(...red)
                .end()
                .vertex()
                    .position(0.5, -0.5, 0.5)
                    .color(...red)
                .end()
                .vertex()
                    .position(0.5, -0.5, -0.5)
                    .color(...red)
                .end()
            .end()
            /* Front triangle. */
            .triangle()
                .vertex()
                    .position(-0.5, -0.5, 0.5)
                    .color(...green)
                .end()
                .vertex()
                    .position(0.5, -0.5, 0.5)
                    .color(...green)
                .end()
                .vertex()
                    .position(0, 0.5, 0)
                    .color(...green)
                .end()
            .end()
            /* Left triangle. */
            .triangle()
                .vertex()
                    .position(-0.5, -0.5, 0.5)
                    .color(...gray)
                .end()
                .vertex()
                    .position(-0.5, -0.5, -0.5)
                    .color(...gray)
                .end()
                .vertex()
                    .position(0, 0.5, 0)
                    .color(...gray)
                .end()
            .end()
            /* Back triangle. */
            .triangle()
                .vertex()
                    .position(-0.5, -0.5, -0.5)
                    .color(...purple)
                .end()
                .vertex()
                    .position(0.5, -0.5, -0.5)
                    .color(...purple)
                .end()
                .vertex()
                    .position(0, 0.5, 0)
                    .color(...purple)
                .end()
            .end()
            /* Right triangle. */
            .triangle()
                .vertex()
                    .position(0.5, -0.5, -0.5)
                    .color(...blue)
                .end()
                .vertex()
                    .position(0.5, -0.5, 0.5)
                    .color(...blue)
                .end()
                .vertex()
                    .position(0, 0.5, 0)
                    .color(...blue)
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
        node.transform = mat4.rotate_y(angle / 1000 * delta).times(node.transform)
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
