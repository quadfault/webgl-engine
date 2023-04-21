/* phong-fs.js - Phong shading fragment shader.
 * Written by quadfault
 * 4/17/23
 */

export const PHONG_VS = `
precision highp float;

varying vec4 v_Color;

/* The intensity of the ambient light in the scene. This is a per-scene uniform. */
uniform float u_AmbientIntensity;
/* The intensity of the one light source in the scene. We assume there is only one light source, and that light
 * source is a point light.
 */
uniform float u_LightIntensity;

void main() {
    /* FIXME: For now, assume the material reflects all light components. */
    float ka = 1.0;
    float kd = 1.0;
    float ks = 1.0;

    /* FIXME: For now, assume the material's shininess. */
    float ns = 20.0;

    float Ia = ka * u_AmbientIntensity;
    float Id = kd * n_dot_l * Il;
    float Is = ks * pow(r_dot_v, ns) * Il;

    float I = Ia + Id + Is;

    gl_FragColor = I * v_Color;
}
`
