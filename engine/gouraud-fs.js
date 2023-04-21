/* gouraud-fs.js - Gouraud shading fragment shader.
 * Written by quadfault
 * 4/20/23
 */

export const GOURAUD_FS = `
precision mediump float;

varying vec4 v_Color;

void main() {
    gl_FragColor = v_Color;
}
`
