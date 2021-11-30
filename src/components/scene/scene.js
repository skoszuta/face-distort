import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import DistortShader from './services/DistortShader'
import StylizedMaterial from './services/StylizedMaterial'
import Texture from '../texture/texture'

const FRAME_GRAB_INTERVAL = 50

let camera, scene, renderer, composer, distortPass
let mesh, material
let tick = 0
let initTimestamp

function init(state) {
  Scene.state = state

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

  material = StylizedMaterial.create()

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
  material.uniforms.map.value.needsUpdate = true
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

  if (tick - Scene.state.lastSnapTick > FRAME_GRAB_INTERVAL) {
    Texture.draw(Scene.state)
    Scene.updateMaterial()
    Scene.state.lastSnapTick = tick
  }

  composer.render()
}

const Scene = {
  state: null,
  init,
  animate,
  updateMaterial,
}

export default Scene
