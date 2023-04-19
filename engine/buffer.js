/* buffer.js - Buffers.
 * Written by quadfault
 * 4/18/23
 */

import { EngineError } from './error.js'

/* A buffer encapsulates a WebGL buffer, including its target and underlying data. */
export class Buffer {
    /* The rendering context. */
    #ctx

    /* The underlying WebGL buffer. */
    #glBuffer

    /* The type of buffer, either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER. */
    #target

    /* Construct a new buffer from the DataView `data` for the target `target`, which must be either
     * gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER.
     */
    constructor(ctx, target, data) {
        this.#ctx = ctx
        this.#target = target

        const gl = this.#ctx.gl

        this.#glBuffer = gl.createBuffer()
        if (!this.#glBuffer)
            throw new EngineError('failed to create buffer')

        gl.bindBuffer(this.#target, this.#glBuffer)
        gl.bufferData(this.#target, data, gl.STATIC_DRAW)
    }

    bind() {
        const gl = this.#ctx.gl

        gl.bindBuffer(this.#target, this.#glBuffer)
    }
}

