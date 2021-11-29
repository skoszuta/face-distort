const StylizeShader = {
    uniforms: {
      tDiffuse: { value: null },
      tick: { value: 0 },
    },
  
    vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }`,
  
    fragmentShader: /* glsl */ `
          uniform sampler2D tDiffuse;
          uniform float tick;
          varying vec2 vUv;
          
          void main() {
              vec4 originalColor = texture2D(tDiffuse , vUv );
              vec4 invertedColor = vec4(1.0 - originalColor.r, 1.0 - originalColor.g, 1.0 - originalColor.b, 1.);
              float luminance = invertedColor.r * 0.3 + invertedColor.g * 0.59 + invertedColor.b * 0.11;
              vec4 bnwColor = vec4(luminance, luminance, luminance, 1.);

              gl_FragColor = bnwColor;
          }`,
  }
  
  export default StylizeShader
  