/* renderer.js - WebGL renderer.
 * Written by quadfault
 * 2/27/23
 */

import { Context } from './context.js'
import { EngineError } from './error.js'
import { loadGltfAssetAsync, scenesFromAsset } from './gltf.js'

/* A WebGL renderer attached to a canvas. */
export class Renderer {
    /* The WebGL context of the associated HTML canvas. */
    #ctx

    /* The canvas we are rendering to. */
    #canvas

    /* The scene to render. */
    #scene = null

    /* Construct a new renderer on the given canvas. */
    constructor(canvas) {
        const gl = canvas.getContext('webgl')
        if (!gl)
            throw new EngineError('could not get WebGL context on canvas element')

        this.#ctx = new Context(gl)
        this.#canvas = canvas

        gl.enable(gl.DEPTH_TEST)
    }

    /* Load the scenes described in the glTF 2.0 asset located at `url`. The URL should not be relative (except
     * protocol-relative), as browsers do not have a concept of "working directory", and the URL would be interpreted
     * relative to this file, not the caller.
     *
     * TODO: For now, we only use the default scene (or scene 0 if no default.)
     * TODO: glTF assets do not have to store scenes. They can be used to load objects that can be inserted into
     *       external scenes. We should support this.
     */
    async loadGltfAssetAsync(url) {
        const asset = await loadGltfAssetAsync(url)
        const [scenes, defaultSceneIndex] = scenesFromAsset(this.#ctx, asset)

        this.#scene = scenes[defaultSceneIndex]
    }

    /* Update the scene. */
    update(delta) {
        this.#scene.update(delta)
    }

    /* Render the scene. */
    render() {
        if (!this.#scene)
            throw new EngineError('no scene to render!')

        this.#scene.render()
    }

    /* Animate the scene. */
    animate() {
        let lastTimestamp

        const step = (timestamp) => {
            const delta = lastTimestamp ? timestamp - lastTimestamp : 0
            lastTimestamp = timestamp

            this.update(delta)
            this.render()

            window.requestAnimationFrame(step)
        }

        window.requestAnimationFrame(step)
    }
}
