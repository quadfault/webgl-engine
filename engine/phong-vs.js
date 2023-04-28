/* phong-vs.js - Phong shading vertex shader.
 * Written by quadfault
 * 4/20/23
 */

export const PHONG_VS = `
attribute vec4 a_Position;          /* Vertex position, in model space. */
attribute vec4 a_Normal;            /* Vertex normal, in model space. */

uniform mat4 u_ModelTransform;      /* Transforms position into world space. */
uniform mat4 u_VpTransform;         /* Transforms position in world space into clip space. */
uniform mat4 u_NormalTransform;     /* Transforms normal into world space. */

varying vec4 v_Position;
varying vec4 v_Normal;

void main() {
    vec4 worldPosition = u_ModelTransform * a_Position;

    gl_Position = u_VpTransform * worldPosition;
    v_Position = worldPosition;
    v_Normal = normalize(u_NormalTransform * a_Normal);
}
`
