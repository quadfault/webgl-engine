/* math.js - Vector/matrix math for WebGL.
 * Written by quadfault
 * 1/25/23
 */

/* A 4-dimensional column vector that can represent 3-dimensional homogenous vectors and points, and RGBA colors. */
export class vec4 {
    /* The components of this vector as a 4-element array [x, y, z, w]. */
    v

    /* Construct a new vec4 from the 4-element array `components`. */
    constructor(components) {
        this.v = components
    }

    /* Construct a new vec4 with components [x, y, z, w]. */
    static make(x, y, z, w) {
        return new vec4([x, y, z, w])
    }

    /* Return a new zero vector. */
    static zero() {
        return vec4.make(0, 0, 0, 0)
    }

    /* Scalar multiplication. Return a new vector with each component of this vector multiplied by `scalar`. */
    times(scalar) {
        return vec4.make(scalar * this.v[0], scalar * this.v[1], scalar * this.v[2], scalar * this.v[3])
    }

    /* Return a new vector that is the negation of this vector (scalar multiply by -1.) */
    negate() {
        return this.times(-1)
    }

    /* Return the component in row `r` (0 <= `r` <= 3). */
    at(r) {
        return this.v[r]
    }

    /* Set the component in row `r` to the value `a` (0 <= `r` <= 3). */
    setAt(r, a) {
        this.v[r] = a
    }

    /* Return the components of this vector as a 4-element array [x, y, z, w]. */
    asArray() {
        return this.v
    }
}

/* A 4x4 homogenous matrix. */
export class mat4 {
    /* Construct a new mat4 with 'entries' specified in column-major order. */
    constructor(entries) {
        this.m = entries
    }

    /* Construct a new mat4 with 'entries' specified in row-major order. This constructor is more natural if you
     * are specifiying the entries directly in code.
     */
    static from_rows(entries) {
        return new mat4(entries).transpose()
    }

    /* Return a new zero matrix. */
    static zero() {
        return new mat4([
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
        ])
    }

    /* Return a new identity matrix. */
    static identity() {
        return new mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
    }

    /* Return a new translation matrix that translates points by the vector (tx, ty, tz). It does not affect
     * vectors.
     */
    static translate(tx, ty, tz) {
        return mat4.from_rows([
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1,
        ])
    }

    static translate_v(v) {
        return mat4.translate(...v)
    }

    /* Return a new rotation matrix from the given quaternion q = [qx, qy, qz, qw]. */
    static rotate(qx, qy, qz, qw) {
        return mat4.from_rows([
            1 - 2 * (qy * qy + qz * qz),      2 * (qx * qy - qw * qz),      2 * (qx * qz + qw * qy),  0,
                2 * (qx * qy + qw * qz),  1 - 2 * (qx * qx + qz * qz),      2 * (qy * qz - qw * qx),  0, 
                2 * (qx * qz - qw * qy),      2 * (qy * qz + qw * qx),  1 - 2 * (qx * qx + qy * qy),  0,
                                      0,                            0,                            0,  1,
        ])
    }

    static rotate_v(v) {
        return mat4.rotate(...v)
    }

    /* Return a new rotation matrix that rotates points/vectors by 'angle' degrees around the positive x-axis. */
    static rotate_x(angle) {
        return mat4.rotate_x_radians(angle * Math.PI / 180)
    }

    static rotate_x_radians(angle) {
        const cosA = Math.cos(angle)
        const sinA = Math.sin(angle)

        return mat4.from_rows([
            1,    0,     0, 0,
            0, cosA, -sinA, 0,
            0, sinA,  cosA, 0,
            0,    0,     0, 1,
        ])
    }

    /* Return a new rotation matrix that rotates points/vectors by 'angle' degrees around the positive y-axis. */
    static rotate_y(angle) {
        return mat4.rotate_y_radians(angle * Math.PI / 180)
    }

    static rotate_y_radians(angle) {
        const cosA = Math.cos(angle)
        const sinA = Math.sin(angle)

        return mat4.from_rows([
             cosA, 0, sinA, 0,
                0, 1,    0, 0,
            -sinA, 0, cosA, 0,
                0, 0,    0, 1,
        ])
    }

    /* Return a new rotation matrix that rotates points by 'angle' degrees around the positive z-axis. */
    static rotate_z(angle) {
        return mat4.rotate_z_radians(angle * Math.PI / 180)
    }

    static rotate_z_radians(angle) {
        const cosA = Math.cos(angle)
        const sinA = Math.sin(angle)

        return mat4.from_rows([
            cosA, -sinA, 0, 0,
            sinA,  cosA, 0, 0,
               0,   0,   1, 0,
               0,   0,   0, 1,
        ])
    }

    /* Return a new scaling matrix that scales points/vectors by (sx, sy, sz). */
    static scale(sx, sy, sz) {
        return mat4.from_rows([
            sx,  0,  0, 0,
             0, sy,  0, 0,
             0,  0, sz, 0,
             0,  0,  0, 1,
        ])
    }

    static scale_v(v) {
        return mat4.scale(...v)
    }

    /* Return a new look-at matrix, with eye point (xeye, yeye, zeye), look-at point (xat, yat, zat), and up-angle
     * up, in degrees.
     */
    static look_at([xeye, yeye, zeye], [xat, yat, zat], up) {
        /* The look-at point is specified in world space, so we need to translate it into view space. */
        xat -= xeye
        yat -= yeye
        zat -= zeye

        /* Convert the look-at point into spherical coordinates, where yat points up. This will give us the two
         * angles theta and phi, which we use to rotate world space into view space so we are looking at the look-at
         * point.
         */
        const rho = Math.sqrt(xat * xat + yat * yat + zat * zat)
        const theta = Math.atan2(-xat, -zat)
        const phi = Math.acos(yat / rho)

        /* We transform the world space coordinate frame into the view space coordinate frame, which means we use the
         * opposite transform on the objects in the scene.
         */
        return (mat4
            .translate(-xeye, -yeye, -zeye)
            .rotate_y_radians(-theta)
            .rotate_x_radians(phi - Math.PI / 2)
            .rotate_z(-up))
    }

    /* Return a new orthographic projection matrix. The parameters are as defined in section 3.10.3.4 of the
     * glTF 2.0 spec.
     *
     * xmag  - half the width of the viewing volume
     * ymag  - half the height of the viewing volume
     * znear - distance to the near clipping plane (should be nonnegative)
     * zfar  - distance to the far clipping plane (should be positive)
     */
    static orthographic(xmag, ymag, znear, zfar) {
        /* As defined in section 3.10.3.4 of the glTF 2.0 spec. */
        return mat4.from_rows([
            1 / xmag,  0,         0,                   0,
            0,         1 / ymag,  0,                   0,
            0,         0,         2 / (znear - zfar),  (zfar + znear) / (znear - zfar),
            0,         0,         0,                   1,
        ])
    }

    /* Return a new perspective projection matrix. The parameters are as defined in sections 3.10.3.2 and 3.10.3.3
     * of the glTF 2.0 spec.
     *
     * aspectRatio - aspect ratio (width over height) of the viewport
     * yfov        - vertical field of view in radians
     * znear       - distance to the near clipping plane (should be nonnegative)
     * zfar        - distance to the far clipping plane (shoud be positive)
     *
     * If zfar is not provided, the projection is infinite. Otherwise, it is finite.
     */
    static perspective(aspectRatio, yfov, znear, zfar) {
        const a = aspectRatio
        const y = yfov
        const f = zfar
        const n = znear
        const tany = Math.tan(0.5 * y)

        if (zfar)
            return mat4.from_rows([
                1 / (a * tany),  0,         0,                  0,
                0,               1 / tany,  0,                  0,
                0,               0,         (f + n) / (n - f),  2 * f * n / (n - f),
                0,               0,         -1,                 0,
            ])
        else
            return mat4.from_rows([
                1 / (a * tany),  0,          0,  0,
                0,               1 / tany,   0,  0,
                0,               0,         -1,  -2 * n,
                0,               0,         -1,  0,
            ])
    }

    /* Return the entry at row 'i', column 'j'. Indexing is zero-based. */
    at(i, j) {
        return this.m[i + j * 4]
    }

    /* Set the entry at row 'i', column 'j' to 'e'. Indexing is zero-based. */
    set_at(i, j, e) {
        this.m[i + j * 4] = e
    }

    /* Multiply `this` by `that`. The parameter `that` can be a vec4 or a mat4. */
    times(that) {
        if (that instanceof vec4)
            return this.#times_vec4(that)
        else if (that instanceof mat4)
            return this.#times_mat4(that)
    }

    #times_vec4(that) {
        let product = vec4.zero()

        for (let i = 0; i < 4; ++i) {
            let sum = 0;
            for (let j = 0; j < 4; ++j)
                sum += this.at(i, j) * that.at(j)

            product.setAt(i, sum)
        }

        return product
    }

    #times_mat4(that) {
        let product = mat4.zero()

        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                let sum = 0
                for (let k = 0; k < 4; ++k) {
                    sum += this.at(i, k) * that.at(k, j)
                }

                product.set_at(i, j, sum)
            }
        }

        return product
    }

    transpose() {
        return new mat4([
            this.at(0, 0), this.at(0, 1), this.at(0, 2), this.at(0, 3),
            this.at(1, 0), this.at(1, 1), this.at(1, 2), this.at(1, 3),
            this.at(2, 0), this.at(2, 1), this.at(2, 2), this.at(2, 3),
            this.at(3, 0), this.at(3, 1), this.at(3, 2), this.at(3, 3),
        ])
    }

    /* Return the transpose of the 3x3 adjoint of this matrix, zeroing any translation components. This is used
     * to correctly transform normal vectors from a mesh's model transform.
     */
    adjointTranspose() {
        const sd00 = this.at(1, 1) * this.at(2, 2) - this.at(1, 2) * this.at(2, 1)
        const sd01 = this.at(1, 0) * this.at(2, 2) - this.at(1, 2) * this.at(2, 0)
        const sd02 = this.at(1, 0) * this.at(2, 1) - this.at(1, 1) * this.at(2, 0)
        const sd10 = this.at(0, 1) * this.at(2, 2) - this.at(0, 2) * this.at(2, 1)
        const sd11 = this.at(0, 0) * this.at(2, 2) - this.at(0, 2) * this.at(2, 0)
        const sd12 = this.at(0, 0) * this.at(2, 1) - this.at(0, 1) * this.at(2, 0)
        const sd20 = this.at(0, 1) * this.at(1, 2) - this.at(0, 2) * this.at(1, 1)
        const sd21 = this.at(0, 0) * this.at(1, 2) - this.at(0, 2) * this.at(1, 0)
        const sd22 = this.at(0, 0) * this.at(1, 1) - this.at(0, 1) * this.at(1, 0)

        const adjoint = mat4.from_rows([
             sd00, -sd10,  sd20, 0,
            -sd01,  sd11, -sd21, 0,
             sd02, -sd12,  sd22, 0,
             0,     0,     0,    1,
        ])

        return adjoint.transpose()
    }

    /* Return the inverse of this matrix. This matrix must be a rigid-body (Euclidean) transform. Note that
     * a rigid-body transform can only include rotations, reflections, and translations, and the translations must
     * all come last in application order.
     */
    inverseRigid() {
        const invRotation = mat4.from_rows([
            this.at(0, 0), this.at(1, 0), this.at(2, 0), 0,
            this.at(0, 1), this.at(1, 1), this.at(2, 1), 0,
            this.at(0, 2), this.at(1, 2), this.at(2, 2), 0,
            0,             0,             0,             1,
        ])
        const invTranslation = mat4.from_rows([
            1, 0, 0, -this.at(0, 3),
            0, 1, 0, -this.at(1, 3),
            0, 0, 1, -this.at(2, 3),
            0, 0, 0, 1,
        ])

        return invRotation.times(invTranslation)
    }

    translate(tx, ty, tz) {
        return mat4.translate(tx, ty, tz).times(this)
    }

    translate_v(v) {
        return mat4.translate(...v).times(this)
    }

    rotate(qx, qy, qz, qw) {
        return mat4.rotate(qx, qy, qz, qw).times(this)
    }

    rotate_v(v) {
        return mat4.rotate(...v).times(this)
    }

    rotate_x(angle) {
        return mat4.rotate_x(angle).times(this)
    }

    rotate_x_radians(angle) {
        return mat4.rotate_x_radians(angle).times(this)
    }

    rotate_y(angle) {
        return mat4.rotate_y(angle).times(this)
    }

    rotate_y_radians(angle) {
        return mat4.rotate_y_radians(angle).times(this)
    }

    rotate_z(angle) {
        return mat4.rotate_z(angle).times(this)
    }

    rotate_z_radians(angle) {
        return mat4.rotate_z_radians(angle).times(this)
    }

    scale(sx, sy, sz) {
        return mat4.scale(sx, sy, sz).times(this)
    }

    scale_v(v) {
        return mat4.scale(...v).times(this)
    }

    /* Return the entries of the matrix as an array in column-major order. You can pass the return value
     * directly to WebGL functions like gl.uniformMatrix*().
     */
    asArray() {
        return this.m
    }
}

/* Convert degrees to radians. */
export function deg(theta) {
    return theta * Math.PI / 180
}
