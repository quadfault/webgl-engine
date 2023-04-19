/* node.js - Nodes.
 * Written by quadfault
 * 3/11/23
 */

import { Builder } from './builder.js'
import { CameraBuilder } from './camera.js'
import { EngineError } from './error.js'
import { mat4 } from './math.js'
import { TriangleBuilder } from './triangle.js'

/* A node is a collection of meshes and other nodes, all under a single transform. */
export class Node {
    /* The WebGL context. */
    #ctx

    /* The name of this node. */
    #name

    /* The transform for this node, which is applied to all children. */
    #transform

    get transform() {
        return this.#transform
    }

    set transform(t) {
        this.#transform = t
    }

    /* The children of this node, which can be meshes and other nodes. */
    #children = []

    /* The update handler function for this node, called on each update. */
    #updateHandler

    /* Construct a new node with the given name, the given transform, which is applied to the given children
     * when rendering.
     */
    constructor(ctx, name, transform, children, ons) {
        this.#ctx = ctx
        this.#name = name
        this.#transform = transform
        this.#children = children

        for (let on of ons) {
            if (on.event === 'update')
                this.#updateHandler = on.handler
            else
                this.#ctx.canvas.addEventListener(on.event, (ev) => on.handler(this, ev))
        }
    }

    /* Prepare this node and its children for rendering. */
    prepare(transform) {
        transform = transform ? transform.times(this.#transform) : this.#transform

        for (let child of this.#children)
            child.prepare(transform)
    }

    update(delta) {
        this.#updateHandler && this.#updateHandler(this, delta)

        for (let child of this.#children)
            child.update(delta)
    }

    render() {
        for (let child of this.#children)
            child.render()
    }
}

export class NodeBuilder extends Builder {
    #ctx
    #name
    #transform = mat4.identity()
    #children = []
    #ons = []

    #childBuilder

    constructor(parent, ctx, name) {
        super(parent)
        this.#ctx = ctx
        this.#name = name
    }

    transform(mat) {
        this.#transform = mat

        return this
    }

    node(name) {
        if (this.#childBuilder)
            this.#children.push(this.#childBuilder.build())

        this.#childBuilder = new NodeBuilder(this, this.#ctx, name)
        return this.#childBuilder
    }

    camera(name) {
        if (this.#childBuilder)
            this.#children.push(this.#childBuilder.build())

        this.#childBuilder = new CameraBuilder(this, this.#ctx, name)
        return this.#childBuilder
    }

    triangle(name) {
        if (this.#childBuilder)
            this.#children.push(this.#childBuilder.build())

        this.#childBuilder = new TriangleBuilder(this, this.#ctx, name)
        return this.#childBuilder
    }

    on(event, handler) {
        this.#ons.push({ event, handler })

        return this
    }

    build() {
        if (this.#childBuilder)
            this.#children.push(this.#childBuilder.build())

        return new Node(this.#ctx, this.#name, this.#transform, this.#children, this.#ons)
    }
}
