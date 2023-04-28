/* torus.js - Render a torus created in Blender.
 * Written by quadfault
 * 4/13/23
 */

import { Renderer } from '/engine/engine.js'
import { addControls } from './common.js'

/* BEGIN main */

const canvas = document.querySelector('canvas')
const renderer = new Renderer(canvas)

await renderer.loadGltfAssetAsync('/examples/assets/two-lights.gltf')
renderer.select('Scene')
    .ambientColor(0.1, 0.1, 0.1, 1)
addControls(renderer.select('camera-node'))
renderer.select('light1')
    .on('keydown', (node, ev) => {
        if (ev.code === 'KeyJ')
            node.transform(node.transform().translate(0, -0.1, 0))
        else if (ev.code === 'KeyK')
            node.transform(node.transform().translate(0, 0.1, 0))
    })
renderer.select('light2')
    .on('keydown', (node, ev) => {
        if (ev.code === 'KeyL')
            node.transform(node.transform().translate(0, -0.1, 0))
        else if (ev.code === 'Semicolon')
            node.transform(node.transform().translate(0, 0.1, 0))
    })

renderer.animate()

/* END main */
