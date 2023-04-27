/* renderer.js - WebGL renderer.
 * Written by quadfault
 * 2/27/23
 */

import { Context } from './context.js'
import { EngineError } from './error.js'
import { loadGltfAssetAsync, scenesFromAsset } from './gltf.js'
import { GOURAUD_VS } from './gouraud-vs.js'
import { GOURAUD_FS } from './gouraud-fs.js'

/* A WebGL renderer attached to a canvas. */
export class Renderer {
    /* The WebGL context of the associated HTML canvas. */
    #ctx

    /* The canvas we are rendering to. */
    #canvas

    /* A ResizeObserver that responds to changes in the canvas size. */
    #resizeObserver

    /* The scene to render. */
    #scene = null

    /* Construct a new renderer on the given canvas. */
    constructor(canvas) {
        const gl = canvas.getContext('webgl2')
        if (!gl)
            throw new EngineError('could not get WebGL context on canvas element')

        this.#ctx = new Context(gl)
        this.#canvas = canvas

        this.#resizeObserver = new ResizeObserver(this.#adjustViewport)
        this.#resizeObserver.observe(this.#canvas)
        this.#adjustViewport()

        this.#initGl()
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

    select(name) {
        return this.#scene.select(name)
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

    #adjustViewport() {
        /* Match the canvas size to its CSS size. */
        this.#canvas.width = this.#canvas.clientWidth
        this.#canvas.height = this.#canvas.clientHeight

        /* Match the WebGL viewport to the new canvas size. */
        this.#ctx.gl.viewport(0, 0, this.#canvas.width, this.#canvas.height)
    }

    /* Initialize all per-renderer GL state, including loading the shaders. */
    #initGl() {
        const gl = this.#ctx.gl

        gl.enable(gl.DEPTH_TEST)

        this.#loadShaders(GOURAUD_VS, GOURAUD_FS)
    }

    /* Load the vertex and fragment shaders from the source strings `vsSrc` and `fsSrc`, respectively. */
    #loadShaders(vsSrc, fsSrc) {
        const gl = this.#ctx.gl

        const vs = this.#compileShader(gl.VERTEX_SHADER, vsSrc)
        const fs = this.#compileShader(gl.FRAGMENT_SHADER, fsSrc)

        const program = gl.createProgram()
        if (!program)
            throw new EngineError('failed to create shader program object')

        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(program)
            gl.deleteProgram(program)
            throw new EngineError(`shader program linking failed: ${log}`)
        }

        gl.useProgram(program)

        this.#ctx.addAttr('a_Position', gl.getAttribLocation(program, 'a_Position'))
        this.#ctx.addAttr('a_Normal', gl.getAttribLocation(program, 'a_Normal'))
        this.#ctx.addAttr('u_ModelTransform', gl.getUniformLocation(program, 'u_ModelTransform'))
        this.#ctx.addAttr('u_VpTransform', gl.getUniformLocation(program, 'u_VpTransform'))
        this.#ctx.addAttr('u_NormalTransform', gl.getUniformLocation(program, 'u_NormalTransform'))
        this.#ctx.addAttr('u_Color', gl.getUniformLocation(program, 'u_Color'))
        this.#ctx.addAttr('u_AmbientColor', gl.getUniformLocation(program, 'u_AmbientColor'))

        for (let i = 0; i < 4; ++i) {
            const u_Light = `u_Lights[${i}]`

            this.#ctx.addAttr(`${u_Light}.type`, gl.getUniformLocation(program, `${u_Light}.type`))
            this.#ctx.addAttr(`${u_Light}.position`, gl.getUniformLocation(program, `${u_Light}.position`))
            this.#ctx.addAttr(`${u_Light}.direction`, gl.getUniformLocation(program, `${u_Light}.direction`))
            this.#ctx.addAttr(`${u_Light}.color`, gl.getUniformLocation(program, `${u_Light}.color`))
        }
    }

    #compileShader(type, src) {
        const gl = this.#ctx.gl

        const shader = gl.createShader(type)
        if (!shader)
            throw new EngineError('failed to create shader object')
        
        gl.shaderSource(shader, src)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader)
            gl.deleteShader(shader)
            throw new EngineError(`shader compilation failed: ${log}`)
        }

        return shader
    }
}
