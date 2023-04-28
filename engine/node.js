/* node.js - Nodes.
 * Written by quadfault
 * 3/11/23
 */

import { EngineError } from './error.js'
import { mat4 } from './math.js'

/* A node is a collection of meshes and other nodes, all under a single transform. */
export class Node {
    /* The WebGL context. */
    #ctx

    /* The name of this node. */
    #name

    /* The transform for this node, which is applied to all children. */
    #transform

    /* The children of this node, which can be meshes and other nodes. */
    #children = []

    /* The update handler function for this node, called on each update. */
    #updateHandler

    /* Construct a new node with the given name, the given transform, which is applied to the given children
     * when rendering.
     */
    constructor(ctx, name, transform, children) {
        this.#ctx = ctx
        this.#name = name
        this.#transform = transform
        this.#children = children
    }

    select(name) {
        if (this.#name === name)
            return this

        for (let child of this.#children) {
            const result = child.select(name)
            if (result)
                return result
        }

        return null
    }

    on(event, handler) {
        if (event === 'update')
            this.#updateHandler = handler
        else
            this.#ctx.canvas.addEventListener(event, (ev) => handler(this, ev))

        return this
    }

    /* Get or set the transform of this node. */
    transform(t) {
        if (t) {
            this.#transform = t
            return this
        }

        return this.#transform
    }

    /* Prepare this node and its children for rendering. */
    prepare(transform) {
        transform = transform ? transform.times(this.#transform) : this.#transform

        let meshes = []
        for (let child of this.#children)
            meshes.push(...child.prepare(transform))

        return meshes
    }

    update(delta) {
        this.#updateHandler && this.#updateHandler(this, delta)

        for (let child of this.#children)
            child.update(delta)
    }
}
