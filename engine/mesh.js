/* mesh.js - Meshes.
 * Written by quadfault
 * 3/11/23
 */

import { EngineError } from './error.js'

/* A mesh represents a cohesive and independently-targetable set of primitives to be rendered. */
export class Mesh {
    /* The rendering context. */
    #ctx

    /* The name of this mesh. */
    #name

    /* The primitives that compose this mesh. */
    #primitives

    constructor(ctx, name, primitives) {
        this.#ctx = ctx
        this.#name = name
        this.#primitives = primitives
    }

    prepare(transform) {
        for (let primitive of this.#primitives)
            primitive.prepare(transform)
    }

    render() {
        for (let primitive of this.#primitives)
            primitive.render()
    }
}

/* Number of bytes per element in a Float32Array. */
const FLOATS = Float32Array.BYTES_PER_ELEMENT

export function setup_attrs(gl, attrs, vertexBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    gl.vertexAttribPointer(attrs.a_Position, 4, gl.FLOAT, false, 8 * FLOATS, 0 * FLOATS)
    gl.enableVertexAttribArray(attrs.a_Position)

    gl.vertexAttribPointer(attrs.a_Color, 4, gl.FLOAT, false, 8 * FLOATS, 4 * FLOATS)
    gl.enableVertexAttribArray(attrs.a_Color)
}

export function prepare_buffer(gl, vertices) {
    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer)
        throw new EngineError('failed to create vertex buffer')

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    return vertexBuffer
}
