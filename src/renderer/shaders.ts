// Gets rid of comments
// \/\*(\*(?!\/) | [^*])*\*\/  --> /* detect multi-line comment */
// (\/\/).*                  --> // detect comments until end of line
const comments = new RegExp('\\/\\*(\\*(?!\\/)|[^*])*\\*\\/|(\\/\\/).*', 'gm');

export const VERTEX_SOURCE = `#version 300 es
    in vec4 a_vertex;
    in vec4 a_color;
    in vec3 a_normal;

    uniform mat4 u_matrix;

    out lowp vec4 v_color;
    out vec3 v_normal;

    void main() {
        gl_Position = u_matrix * a_vertex;
        v_color = a_color;
        v_normal = a_normal;
    }
`.replace(comments, '');

export const FRAGMENT_SOURCE = `#version 300 es
    precision highp float;

    in lowp vec4 v_color;
    in vec3 v_normal;

    uniform vec3 u_reverseLightDirection;

    out vec4 outColor;

    void main(void) {
        // Because v_normal is a varying it's interpolated
        // so it will not be a unit vector. Normalizing it
        // will make it a unit vector again
        vec3 normal = normalize(v_normal);

        float light = dot(normal, u_reverseLightDirection);

        outColor = v_color;

        outColor.rgb *= light;
    }
`.replace(comments, '');
