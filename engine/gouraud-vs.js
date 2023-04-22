/* gouraud-vs.js - Gouraud shading vertex shader.
 * Written by quadfault
 * 4/20/23
 */

export const GOURAUD_VS = `
attribute vec4 a_Position;
attribute vec4 a_Normal;            /* We assume the normal is already a unit vector. */

uniform mat4 u_ModelTransform;      /* Transforms position into world space. */
uniform mat4 u_VpTransform;         /* Transforms position in world space into clip space. */
uniform mat4 u_NormalTransform;     /* Transforms normal into world space. */
uniform vec4 u_Color;

uniform vec4 u_AmbientColor;        /* Ambient light color, per scene. */

uniform struct Light {
    int  type;                      /* The type of light: 0 for no light, 1 for directional, 2 for point. */
    vec4 position;                  /* The position of the light in world space. */
    vec4 direction;                 /* The direction of the light, pointing AWAY from the surface. */
    vec4 color;                     /* The intensity of the light in each color channel. */
} u_Lights[4];

varying vec4 v_Color;

void main() {
    vec4 worldPosition = u_ModelTransform * a_Position;
    vec4 N = normalize(u_NormalTransform * a_Normal);

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
            L = normalize(u_Lights[i].position - worldPosition);
        } else {
            /* Bad light type. */
            L = vec4(0.0);
        }

        float N_dot_L = max(dot(N, L), 0.0);
        diffuse += u_Lights[i].color.rgb * u_Color.rgb * N_dot_L;
    }

    gl_Position = u_VpTransform * worldPosition;
    v_Color = vec4(ambient + diffuse, u_Color.a);
}
`
