/* primitive.js - Primitives.
 * Written by quadfault
 * 4/18/23
 */

/* A primitive specifies a set of vertices and their topology (e.g. points, lines, triangles, etc.) */
export class Primitive {
    /* The rendering context. */
    #ctx

    /* The kind of primitive being drawn, e.g. gl.POINTS, gl.TRIANGLES, etc. */
    #mode

    /* The vertex position attribute. */
    #positionAttr

    /* The vertex normal attribute. */
    #normalAttr

    /* The material defining the reflectance model for this primitive. */
    #material

    /* For an indexed primitive, a Buffer containing the indices. */
    #indexBuffer

    /* For an indexed primitive, the number of indices. */
    #indexCount

    /* For an indexed primitive, the type of each index. Must be either gl.UNSIGNED_BYTE or gl.UNSIGNED_SHORT. */
    #indexType

    /* For an indexed primitive, the byte offset of the first index in the index buffer. */
    #indexOffset

    /* The model transform of this primitive, inherited from its ancestor nodes. */
    #modelTransform = null

    constructor(ctx, mode, positionAttr, normalAttr, material, indexBuffer, indexCount, indexType, indexOffset) {
        this.#ctx = ctx
        this.#mode = mode
        this.#positionAttr = positionAttr
        this.#normalAttr = normalAttr
        this.#material = material
        this.#indexBuffer = indexBuffer
        this.#indexCount = indexCount
        this.#indexType = indexType
        this.#indexOffset = indexOffset
    }

    select(name) {
        return this.#material.select(name)
    }

    prepare(transform) {
        this.#modelTransform = transform
    }

    /* Render this primitive. */
    render() {
        const gl = this.#ctx.gl
        const attrs = this.#ctx.attrs
        const vpTransform = this.#ctx.vpTransform

        this.#material.render()

        this.#positionAttr.attach()
        this.#normalAttr.attach()
        gl.uniformMatrix4fv(attrs.u_ModelTransform, false, this.#modelTransform.asArray())
        gl.uniformMatrix4fv(attrs.u_VpTransform, false, vpTransform.asArray())
        /* FIXME: This should actually be the inverse transpose of the model transform. */
        gl.uniformMatrix4fv(attrs.u_NormalTransform, false, this.#modelTransform.asArray())

        if (this.#indexBuffer) {
            this.#indexBuffer.bind()
            gl.drawElements(this.#mode, this.#indexCount, this.#indexType, this.#indexOffset)
        } else {
            gl.drawArrays(this.#mode, this.#positionAttr.count, this.#positionAttr.first)
        }
    }
}
