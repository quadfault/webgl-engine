/* lat.js - Look at triangles.
 * Written by quadfault
 * 2/27/23
 */

import { Renderer, mat4, deg } from './engine.js'

/* BEGIN main */

let xeye = 1.8

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

                console.log('hello')

                node.transform = mat4.look_at([xeye, 2.25, 2.25], [0, 0, 0], 0)
            })
            .camera()
                .projection(mat4.perspective(1, deg(30), 0.1))
            .end()
        .end()
        .node()
            /* Back triangle. */
            .triangle()
                .vertex() 
                    .position(0, 0.5, -0.4)
                    .color(0.4, 1, 0.4, 1)
                .end()
                .vertex()
                    .position(-0.5, -0.5, -0.4)
                    .color(0.4, 1.0, 0.4, 1)
                .end()
                .vertex()
                    .position(0.5, -0.5, -0.4)
                    .color(1, 0.4, 0.4, 1)
                .end()
            .end()
            /* Middle triangle. */
            .triangle()
                .vertex()
                    .position(0.5, 0.4, -0.2)
                    .color(1, 0.4, 0.4, 1)
                .end()
                .vertex()
                    .position(-0.5, 0.4, -0.2)
                    .color(1, 1, 0.4, 1)
                .end()
                .vertex()
                    .position(0, -0.6, -0.2)
                    .color(1, 1, 0.4, 1)
                .end()
            .end()
            /* Front triangle. */
            .triangle()
                .vertex()
                    .position(0, 0.5, 0)
                    .color(0.4, 0.4, 1, 1)
                .end()
                .vertex()
                    .position(-0.5, -0.5, 0.0)
                    .color(0.4, 0.4, 1, 1)
                .end()
                .vertex()
                    .position(0.5, -0.5, 0)
                    .color(1, 0.4, 0.4, 1)
                .end()
            .end()
        .end()
    .end()
.end()

renderer.animate()

/* END main */
