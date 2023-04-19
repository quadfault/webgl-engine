/* camera.js - Cameras.
 * Written by quadfault
 * 3/18/23
 */

import { Builder } from './builder.js'

/* A simple pinhole camera.
 *
 * TODO: Right now, this camera does nothing. The view transform for the camera is given by its parent node.
 */
export class Camera {
    /* The rendering context. */
    #ctx

    /* The name of this camera. */
    #name

    /* The projection matrix of this camera. */
    #projection

    constructor(ctx, name, projection) {
        this.#ctx = ctx
        this.#name = name
        this.#projection = projection
    }

    /* Prepare the camera for rendering. This means setting the view transform for the scene from the inherited
     * transforms of the camera's ancestor nodes.
     */
    prepare(transform) {
        this.#ctx.viewTransform = this.#projection.times(transform.inverseRigid())
    }

    update() {}

    render() {}
}

export class CameraBuilder extends Builder {
    #ctx
    #name
    #projection

    constructor(parent, ctx, name) {
        super(parent)
        this.#ctx = ctx
        this.#name = name
    }

    projection(mat) {
        this.#projection = mat

        return this
    }

    build() {
        return new Camera(this.#ctx, this.#name, this.#projection)
    }
}
