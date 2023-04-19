/* default-fs.js - Default fragment shader.
 * Written by quadfault
 * 3/11/23
 */

export const DEFAULT_FS = `
precision mediump float;

varying vec4 v_Color;

void main() {
    gl_FragColor = v_Color;
}
`
