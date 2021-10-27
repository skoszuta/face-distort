import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import DistortShader from './services/DistortShader'
import Texture from '../texture/texture'

let camera, scene, renderer, composer, distortPass
let mesh, material
let tick = 0
let initTimestamp

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  document.body.appendChild(renderer.domElement)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(0, 0, 1)
  camera.lookAt(scene.position)

  const geometry = new THREE.PlaneBufferGeometry()

  material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  material.map = new THREE.CanvasTexture(Texture.canvas)

  mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)

  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  distortPass = new ShaderPass(DistortShader)
  distortPass.uniforms['tick'].value = tick
  composer.addPass(distortPass)

  window.addEventListener('resize', onWindowResize)

  initTimestamp = new Date().getTime()
}

function updateMaterial() {
  material.map.needsUpdate = true
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  requestAnimationFrame(animate)
  tick = Math.ceil((new Date().getTime() - initTimestamp) / 16.67)
  distortPass.uniforms['tick'].value = tick
  composer.render()
}

const Scene = {
  init,
  animate,
  updateMaterial,
}

export default Scene
