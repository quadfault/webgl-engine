/* phong-vs.js - Phong shading vertex shader.
 * Written by quadfault
 * 4/17/23
 */

export const PHONG_VS = `
attribute vec4 a_Position;
attribute vec4 a_Normal;

uniform mat4 u_mvTransform;
uniform mat4 u_mvpTransform;

uniform vec4 u_LightPosition;
uniform vec

varying vec4 v_Normal;
varying vec4 v_LightPosition;

void main() {
    gl_Position = u_mvpTransform * a_Position;
    v_Normal = u_mvTransform * a_Normal;
    v_LightPosition = u_mvTransform * u_LightPosition;
}
`
