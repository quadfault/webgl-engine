/* cube.js - Render a cube created in Blender.
 * Written by quadfault
 * 4/13/23
 */

import { Renderer } from './engine.js'

/* BEGIN main */

const canvas = document.querySelector('canvas')
const renderer = new Renderer(canvas)

await renderer.loadGltfAssetAsync('/cube.gltf')
renderer.render()

/* END main */
