import * as THREE from 'three'
import Texture from '../../texture/texture'

const StylizedMaterial = {
  create() {
    const texture = new THREE.CanvasTexture(Texture.canvas)

    return new THREE.ShaderMaterial({
      defines: { USE_MAP: '' },
      uniforms: {
        map: { value: texture },
      },
      vertexShader: `
          varying vec2 vUv;
        
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
          `,
      fragmentShader: `
          varying vec2 vUv;
          uniform sampler2D map;
          
          void main() {
            vec4 originalColor = texture2D(map , vUv );
            vec4 invertedColor = vec4(1.0 - originalColor.r, 1.0 - originalColor.g, 1.0 - originalColor.b, 1.);
            float luminance = invertedColor.r * 0.3 + invertedColor.g * 0.59 + invertedColor.b * 0.11;
            vec4 bnwColor = vec4(luminance, luminance, luminance, 1.);
            vec4 amplifiedContrast = (bnwColor - 0.5) * 2. + 0.5;

            gl_FragColor = originalColor;
          }
          `,
    })
  },
}

export default StylizedMaterial
