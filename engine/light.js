/* light.js - Lights.
 * Written by quadfault
 * 4/19/23
 */

import { vec4 } from './math.js'

/* Parent class for a simple "punctual" light, which can be a directional, point, or spot light. */
class Light {
    /* The rendering context. */
    ctx

    /* The name of this light. */
    name

    /* The color of this light, as a vec4 in RGBA format. */
    color

    constructor(ctx, name, color) {
        this.ctx = ctx
        this.name = name
        this.color = color
    }

    select(name) {
        if (this.name === name)
            return this

        return null
    }

    update() {}
}

/* A directional light emits light in one direction and is present everywhere in the scene. */
export class DirectionalLight extends Light {
    constructor(ctx, name, color) {
        super(ctx, name, color)
    }

    prepare(transform) {
        const gl = this.ctx.gl
        const attrs = this.ctx.attrs

        const direction = transform.times(vec4.make(0, 0, -1, 0)).negate()

        gl.uniform1i(attrs.u_LightType, 0)
        gl.uniform4fv(attrs.u_LightPosition, [0, 0, 0, 1])
        gl.uniform4fv(attrs.u_LightDirection, direction.asArray())
        gl.uniform4fv(attrs.u_LightColor, this.color.asArray())

        return []
    }
}

/* A point light has only a position and emits light in all directions. */
export class PointLight extends Light {
    constructor(ctx, name, color) {
        super(ctx, name, color)
    }

    prepare(transform) {
        const gl = this.ctx.gl
        const attrs = this.ctx.attrs

        gl.uniform1i(attrs.u_LightType, 1);
        gl.uniform4fv(attrs.u_LightPosition, transform.times(vec4.make(0, 0, 0, 1)).asArray())
        gl.uniform4fv(attrs.u_LightDirection, [0, 0, 0, 0])
        gl.uniform4fv(attrs.u_LightColor, this.color.asArray())

        return []
    }
}
