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

renderer.animate()

/* END main */
