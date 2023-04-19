/* scene.js - Scenes.
 * Written by quadfault
 * 2/26/23
 */

import { Builder } from './builder.js'
import { Context } from './context.js'
import { DEFAULT_VS } from './default-vs.js'
import { DEFAULT_FS } from './default-fs.js'
import { EngineError } from './error.js'
import { NodeBuilder } from './node.js'

/* A collection of nodes. */
export class Scene {
    /* The rendering context. */
    #ctx

    /* The name of this scene. */
    #name

    /* The collection of nodes. */
    #nodes

    /* Construct a new scene with the given optional name and list of nodes. */
    constructor(ctx, name, nodes) {
        this.#ctx = ctx
        this.#name = name
        this.#nodes = nodes

        this.loadShaders(DEFAULT_VS, DEFAULT_FS)
    }

    update(delta) {
        for (let node of this.#nodes)
            node.update(delta)
    }

    /* Render the scene. */
    render() {
        const gl = this.#ctx.gl

        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        for (let node of this.#nodes)
            node.prepare()

        for (let node of this.#nodes)
            node.render()
    }

    /* PRIVATE */

    loadShaders(vsSrc, fsSrc) {
        const gl = this.#ctx.gl

        const vs = this.compileShader(gl.VERTEX_SHADER, vsSrc)
        const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSrc)

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
        this.#ctx.addAttr('u_Color', gl.getUniformLocation(program, 'u_Color'))
        this.#ctx.addAttr('u_MVT', gl.getUniformLocation(program, 'u_MVT'))
    }

    compileShader(type, src) {
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

export class SceneBuilder extends Builder {
    #ctx
    #name
    #nodes = []

    #nodeBuilder

    constructor(parent, ctx, name) {
        super(parent)
        this.#ctx = ctx
        this.#name = name
    }

    node(name) {
        if (this.#nodeBuilder)
            this.#nodes.push(this.#nodeBuilder.build())

        this.#nodeBuilder = new NodeBuilder(this, this.#ctx, name)
        return this.#nodeBuilder
    }

    build() {
        if (this.#nodeBuilder)
            this.#nodes.push(this.#nodeBuilder.build())

        return new Scene(this.#ctx, this.#name, this.#nodes)
    }
}
