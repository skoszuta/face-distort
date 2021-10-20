import './styles.scss'
import '@tensorflow/tfjs-backend-wasm'
import * as blazeface from '@tensorflow-models/blazeface'
import * as tf from '@tensorflow/tfjs-core'
import Scene from './components/scene/scene'

const CAMERA_CONFIG = {
  audio: false,
  video: { facingMode: 'user' },
}

const state = {
  blazefaceInstance: null,
  stream: null,
  imageCapture: null,
  predictions: null,
  currentFrameBitmap: null,
}

async function run() {
  if (state.imageCapture.track.muted) {
    return
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

  const blazefaceInstance = await blazeface.load()
  const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG)
  const imageCapture = new ImageCapture(stream.getVideoTracks()[0])

  Object.assign(state, {
    blazefaceInstance,
    stream,
    imageCapture,
  })

  state.stream = stream
  state.imageCapture = imageCapture

  Scene.init(state)

  requestAnimationFrame(run)
}

main()
