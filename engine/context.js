/* context.js - A renderer context.
 * Written by quadfault
 * 3/19/23
 */

/* A rendering context that provides all WebGL information necessary to render a scene. */
export class Context {
    /* The WebGL context. */
    gl

    /* The underlying canvas. */
    get canvas() {
        return this.gl.canvas
    }

    /* Shader attributes/uniforms. */
    attrs = {}

    /* Construct a new rendering context with the given WebGL context. */
    constructor(gl) {
        this.gl = gl
    }

    /* Add an attribute/uniform. */
    addAttr(name, location) {
        this.attrs[name] = location
    }
}
