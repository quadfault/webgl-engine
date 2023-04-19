/* vertex.js - Vertices.
 * Written by quadfault
 * 3/11/23
 */

import { Builder } from './builder.js'
import { EngineError } from './error.js'

/* A vertex of a mesh. */
export class Vertex {
    /* The (homogeneous) coordinates of the vertex, in the model space of the parent mesh. */
    #position

    /* The color of the vertex, in RGBA format. */
    #color

    /* Construct a new vertex, where `position` and `color` are 4-element arrays. */
    constructor(position, color) {
        this.#position = position
        this.#color = color
    }

    /* Return an iterator over the vertex that incrementally returns each datum in the order: position, color */
    *[Symbol.iterator]() {
        for (let p of this.#position)
            yield p
        for (let c of this.#color)
            yield c
    }
}

export class VertexBuilder extends Builder {
    #position
    #color

    constructor(parent) {
        super(parent)
    }

    /* Set the position of the vertex in the model space of its parent mesh. */
    position(x, y, z) {
        this.#position = [x, y, z, 1]

        return this
    }

    /* Set the color of the vertex in RGBA format. */
    color(r, g, b, a) {
        this.#color = [r, g, b, a]

        return this
    }

    build() {
        if (!this.#position)
            throw new EngineError('VertexBuilder: must specify position')
        if (!this.#color)
            throw new EngineError('VertexBuilder: must specify color')

        return new Vertex(this.#position, this.#color)
    }
}
