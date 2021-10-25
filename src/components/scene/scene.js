import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import DistortShader from './services/DistortShader'
import Texture from '../texture/texture'

let camera, scene, renderer, composer, distortPass
let mesh, material
let frame = 0

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
  distortPass.uniforms['frame'].value = frame
  composer.addPass(distortPass)

  window.addEventListener('resize', onWindowResize)
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
  frame++
  frame++
  frame++
  distortPass.uniforms['frame'].value = frame
  composer.render()
}

const Scene = {
  init,
  animate,
  updateMaterial,
}

export default Scene
