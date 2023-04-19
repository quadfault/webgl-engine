/* default-vs.js - Default vertex shader.
 * Written by quadfault
 * 3/11/23
 */

export const DEFAULT_VS = `
attribute vec4 a_Position;

uniform vec4 u_Color;
uniform mat4 u_MVT;

varying vec4 v_Color;

void main() {
    gl_Position = u_MVT * a_Position;
    v_Color = u_Color;
}
`
