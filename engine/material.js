/* material.js - Materials.
 * Written by quadfault
 * 4/16/23
 */

/* A material represents how a primitive interacts with light in a scene.
 *
 * TODO: Right now we only support flat RGBA colors.
 */
export class Material {
    /* The rendering context. */
    #ctx

    /* The name of this material. */
    #name

    /* The flat RGBA color this material represents. */
    #color

    get color() {
        return this.#color
    }

    constructor(ctx, name, color) {
        this.#ctx = ctx
        this.#name = name
        this.#color = color
    }
}
