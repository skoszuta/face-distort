const Scene = {
  canvas: document.createElement('canvas'),
  currentState: null,
  draw(state = Scene.currentState) {
    Scene.currentState = state

    if (!state.predictions || !state.predictions.length) {
      return
    }

    const ctx = Scene.canvas.getContext('2d')

    const drawX = state.predictions[0].topLeft[0]
    const drawY = state.predictions[0].topLeft[1]
    const drawWidth =
      state.predictions[0].bottomRight[0] - state.predictions[0].topLeft[0]
    const drawHeight =
      state.predictions[0].bottomRight[1] - state.predictions[0].topLeft[1]

    ctx.drawImage(
      state.currentFrameBitmap,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      0,
      0,
      400,
      300
    )

    // console.log(state.predictions[0])
  },
  init(state) {
    Scene.currentState = state

    Scene.canvas.setAttribute('width', 400)
    Scene.canvas.setAttribute('height', 300)
    document.body.appendChild(Scene.canvas)
  },
}

export default Scene
