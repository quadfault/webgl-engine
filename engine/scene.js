/* scene.js - Scenes.
 * Written by quadfault
 * 2/26/23
 */

import { Context } from './context.js'
import { EngineError } from './error.js'
import { vec4 } from './math.js'

/* A collection of nodes. */
export class Scene {
    /* The rendering context. */
    #ctx

    /* The name of this scene. */
    #name

    /* The collection of nodes. */
    #nodes

    /* The color of the ambient light in the scene. */
    #ambientColor = vec4.make(0, 0, 0, 1)

    /* Construct a new scene with the given optional name and list of nodes. */
    constructor(ctx, name, nodes) {
        this.#ctx = ctx
        this.#name = name
        this.#nodes = nodes
    }

    /* Set or get the ambient light color of this scene. */
    ambientColor(r, g, b, a) {
        if (r) {
            this.#ambientColor = vec4.make(r, g, b, a)
            return this
        }

        return this.#ambientColor
    }

    select(name) {
        if (this.#name === name)
            return this

        for (let node of this.#nodes) {
            const result = node.select(name)
            if (result)
                return result
        }

        return null
    }

    update(delta) {
        for (let node of this.#nodes)
            node.update(delta)
    }

    /* Render the scene. */
    render() {
        const gl = this.#ctx.gl
        const attrs = this.#ctx.attrs

        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform4fv(attrs.u_AmbientColor, this.#ambientColor.asArray())

        /* Render each node. Each node will return a list of (prepared) meshes that are ready to render. We need to
         * render the meshes after all other objects so that things like cameras and lights are fully prepared and
         * can be used in the shaders.
         */
        let meshes = []
        for (let node of this.#nodes)
            meshes.push(...node.prepare())

        for (let mesh of meshes)
            mesh.render()
    }
}
