/* builder.js - Build a scene.
 * Written by quadfault
 * 3/19/23
 */

export class Builder {
    #parent

    get parent() {
        return this.#parent
    }

    constructor(parent) {
        this.#parent = parent
    }

    end() {
        if (this.#parent)
            return this.#parent
        else
            return this.build()
    }

    node(...args) {
        return this.#parent.node(...args)
    }

    triangle(...args) {
        return this.#parent.triangle(...args)
    }

    vertex(...args) {
        return this.#parent.vertex(...args)
    }
}
