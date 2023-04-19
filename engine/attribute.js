/* attribute.js - Vertex attributes.
 * Written by quadfault
 * 4/18/23
 */

import { EngineError } from './error.js'

/* An attribute represents an attribute in a vertex/fragment shader, including the buffer it is accessing and the
 * type and format of the data.
 */
export class Attribute {
    /* The rendering context. */
    #ctx

    /* The name of the underlying WebGL attribute. */
    #attrName

    /* The Buffer this attribute is accessing. */
    #buffer

    /* The number of components. */
    #size

    /* The type of each component. */
    #type

    /* The stride between each successive component. */
    #stride

    /* The offset in bytes of the first component. */
    #offset

    constructor(ctx, buffer, attrName, size, type, stride, offset) {
        this.#ctx = ctx
        this.#buffer = buffer
        this.#attrName = attrName
        this.#size = size
        this.#type = type
        this.#stride = stride
        this.#offset = offset
    }

    get count() {
        throw new EngineError('unimplemented')
    }

    get first() {
        throw new EngineError('unimplemented')
    }

    /* Attach the attribute to the buffer. */
    attach() {
        const gl = this.#ctx.gl
        
        const index = this.#ctx.attrs[this.#attrName]

        this.#buffer.bind()
        gl.vertexAttribPointer(
            index,
            this.#size,
            this.#type,
            false,              /* FIXME: This should be set from the glTF asset. */
            this.#stride,
            this.#offset)
        gl.enableVertexAttribArray(index)
    }
}

