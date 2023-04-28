/* common.js - Common functions for the examples.
 * Written by quadfault
 * 4/27/23
 */

import { mat4 } from '/engine/engine.js'

let shouldRotate = false

export function addControls(node) {
    node
        .on('keydown', (node, ev) => {
            if (ev.code === 'KeyA')
                node.transform(node.transform().times(mat4.translate(0.1, 0, 0)))
            else if (ev.code === 'KeyD')
                node.transform(node.transform().times(mat4.translate(-0.1, 0, 0)))
            else if (ev.code === 'KeyW')
                node.transform(node.transform().times(mat4.translate(0, -0.1, 0)))
            else if (ev.code === 'KeyS')
                node.transform(node.transform().times(mat4.translate(0, 0.1, 0)))
        })
        .on('click', (node, ev) => {
            shouldRotate = !shouldRotate
        })
        .on('mousemove', (node, ev) => {
            if (shouldRotate) {
                const angleY = ev.movementX / 50
                const angleX = ev.movementY / 50

                node.transform(node.transform().times(mat4.rotate_y(-angleY).rotate_x(-angleX)))
            }
        })
        .on('wheel', (node, ev) => {
            ev.preventDefault()

            const zoomLevel = 0.4 * (ev.deltaY > 0 ? 1 : -1)

            node.transform(node.transform().times(mat4.translate(0, 0, zoomLevel)))
        })
}
