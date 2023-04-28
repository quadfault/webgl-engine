/* cube.js - Render a cube created in Blender.
 * Written by quadfault
 * 4/13/23
 */

import { Renderer } from '/engine/engine.js'
import { addControls } from './common.js'

/* BEGIN main */

const canvas = document.querySelector('canvas')
const renderer = new Renderer(canvas)

await renderer.loadGltfAssetAsync('/examples/assets/boxlight.gltf')
renderer.select('Scene')
    .ambientColor(0.1, 0.1, 0.1, 1)
addControls(renderer.select('camera-node'))
renderer.select('light')
    .on('keydown', (node, ev) => {
        if (ev.code === 'KeyJ')
            node.transform(node.transform().translate(0, -0.1, 0))
        else if (ev.code === 'KeyK')
            node.transform(node.transform().translate(0, 0.1, 0))
        else if (ev.code === 'KeyH')
            node.transform(node.transform().translate(-0.1, 0, 0))
        else if (ev.code === 'KeyL')
            node.transform(node.transform().translate(0.1, 0, 0))
        else if (ev.code === 'KeyI')
            node.transform(node.transform().translate(0, 0, -0.1))
        else if (ev.code === 'KeyN')
            node.transform(node.transform().translate(0, 0, 0.1))
    })

renderer.animate()

/* END main */
