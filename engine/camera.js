/* camera.js - Cameras.
 * Written by quadfault
 * 3/18/23
 */

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

    select(name) {
        if (this.#name == name)
            return this

        return null
    }

    update() {}

    /* Prepare the camera for rendering. This means setting the view-projection transform for the scene from the
     * inherited transforms of the camera's ancestor nodes.
     */
    prepare(transform) {
        this.#ctx.vpTransform = this.#projection.times(transform.inverseRigid())
        
        return []
    }
}
