#define PI 3.141592653587932384626433832795

attribute vec3 positonl
attribute vec2 uv;

uniform float uSpeed;
uniform vec2 uViewportSizes;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying float speed;
varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

    newPosition.z += (sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0)) * uSpeed;

    gl_position = projectionMatrix * newPositon;
}