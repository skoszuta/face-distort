import './styles.scss'
import '@tensorflow/tfjs-backend-wasm'
import * as blazeface from '@tensorflow-models/blazeface'
import * as tf from '@tensorflow/tfjs-core'
import Scene from './components/scene/scene'
import Settings from './components/settings/settings'

const state = {
  blazefaceInstance: null,
  stream: null,
  imageCapture: null,
  predictions: null,
  currentFrameBitmap: null,
  camera: null
}

async function run() {
  if (state.imageCapture.track.muted) {
    return requestAnimationFrame(run)
  }

  const currentFrameBitmap = await state.imageCapture.grabFrame()
  const predictions = await state.blazefaceInstance.estimateFaces(
    currentFrameBitmap,
    false
  )

  state.predictions = predictions
  state.currentFrameBitmap = currentFrameBitmap

  Scene.draw(state)

  requestAnimationFrame(run)
}

async function main() {
  await tf.setBackend('wasm')

  state.blazefaceInstance = await blazeface.load()

  Scene.init(state)
  await Settings.init(state)

  requestAnimationFrame(run)
}

main()
