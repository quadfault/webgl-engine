/* triangle.js - Isolated triangles.
 * Written by quadfault
 * 2/28/23
 */

import { Builder } from './builder.js'
import { EngineError } from './error.js'
import { prepare_buffer, setup_attrs } from './mesh.js'
import { VertexBuilder } from './vertex.js'

/* An isolated triangle. */
export class Triangle {
    /* The rendering context. */
    #ctx

    /* The name of this triangle. */
    #name

    /* The vertices of the triangle, in unpacked form. */
    #vertices = []

    /* The vertices of the triangle, packed into a WebGL buffer. */
    #vertexBuffer

    /* The model transform for this mesh. */
    #modelTransform

    /* Construct a new triangle with the given optional name and list of vertices. */
    constructor(ctx, name, vertices) {
        this.#ctx = ctx
        this.#name = name
        this.#vertices = vertices
    }

    /* Prepare this triangle for rendering. This means packing the vertices into a WebGL buffer if that needs to be
     * done.
     */
    prepare(transform) {
        this.#modelTransform = transform

        if (!this.#vertexBuffer) {
            let vertices = []
            for (let vertex of this.#vertices)
                vertices.push(...vertex)

            vertices = new Float32Array(vertices)

            this.#vertexBuffer = prepare_buffer(this.#ctx.gl, vertices)
        }
    }

    update(delta) {
        /* TODO: nothing yet */
    }

    render() {
        const { gl, attrs, viewTransform } = this.#ctx

        const mvt = viewTransform.times(this.#modelTransform)

        setup_attrs(gl, attrs, this.#vertexBuffer)

        gl.uniformMatrix4fv(attrs.u_MVT, false, mvt.as_array())
        gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
}

export class TriangleBuilder extends Builder {
    #ctx
    #name
    #vertices = []

    #vertexBuilder

    constructor(parent, ctx, name) {
        super(parent)
        this.#ctx = ctx
        this.#name = name
    }

    vertex() {
        if (this.#vertexBuilder)
            this.#vertices.push(this.#vertexBuilder.build())

        this.#vertexBuilder = new VertexBuilder(this)
        return this.#vertexBuilder
    }

    build() {
        if (this.#vertexBuilder)
            this.#vertices.push(this.#vertexBuilder.build())

        if (this.#vertices.length !== 3)
            throw new EngineError('TriangleBuilder: must specify exactly 3 vertices')

        return new Triangle(this.#ctx, this.#name, this.#vertices)
    }
}
