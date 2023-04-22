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

uniform int  u_LightType;           /* The type of light: 0 for directional, 1 for point. */
uniform vec4 u_LightPosition;       /* The position of the light in world space. */
uniform vec4 u_LightDirection;      /* The direction of the light, pointing AWAY from the surface. */
uniform vec4 u_LightColor;          /* The intensity of the light in each color channel. */

varying vec4 v_Color;

void main() {
    vec4 worldPosition = u_ModelTransform * a_Position;

    vec4 L;
    if (u_LightType == 0) {
        /* Directional light. */
        L = u_LightDirection;
    } else if (u_LightType == 1) {
        /* Point light. */
        L = normalize(u_LightPosition - worldPosition);
    } else {
        /* Bad light type. */
        L = vec4(0.0);
    }

    vec4 N = normalize(u_NormalTransform * a_Normal);
    float N_dot_L = max(dot(N, L), 0.0);

    /* Ambient reflection. */
    vec3 ambient = u_AmbientColor.rgb * u_Color.rgb;

    /* A simple diffuse reflection. */
    vec3 diffuse = u_LightColor.rgb * u_Color.rgb * N_dot_L;

    gl_Position = u_VpTransform * worldPosition;
    v_Color = vec4(ambient + diffuse, u_Color.a);
}
`
