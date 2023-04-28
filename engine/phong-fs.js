/* phong-fs.js - Phong shading fragment shader.
 * Written by quadfault
 * 4/17/23
 */

export const PHONG_FS = `
precision highp float;

uniform struct Light {
    int  type;                      /* The type of light: 0 for no light, 1 for directional, 2 for point. */
    vec4 position;                  /* The position of the light in world space. */
    vec4 direction;                 /* The direction of the light, pointing AWAY from the surface. */
    vec4 color;                     /* The intensity of the light in each color channel. */
} u_Lights[4];

uniform vec4 u_Color;               /* Color of this primitive. */
uniform vec4 u_AmbientColor;        /* Ambient light color, per scene. */

varying vec4 v_Position;            /* Fragment position, in world space. */
varying vec4 v_Normal;              /* Fragment normal, in world space. */

void main() {
    /* Ambient reflection. */
    vec3 ambient = u_AmbientColor.rgb * u_Color.rgb;

    /* A simple diffuse reflection, calculated per light. */
    vec3 diffuse = vec3(0.0);
    for (int i = 0; i < 4; ++i) {
        vec4 L;
        if (u_Lights[i].type == 0) {
            continue;
        } else if (u_Lights[i].type == 1) {
            /* Directional light. */
            L = u_Lights[i].direction;
        } else if (u_Lights[i].type == 2) {
            /* Point light. */
            L = normalize(u_Lights[i].position - v_Position);
        } else {
            /* Bad light type. */
            L = vec4(0.0);
        }

        float N_dot_L = max(dot(v_Normal, L), 0.0);
        diffuse += u_Lights[i].color.rgb * u_Color.rgb * N_dot_L;
    }

    gl_FragColor = vec4(ambient + diffuse, u_Color.a);
}
`
