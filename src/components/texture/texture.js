const Texture = {
  canvas: document.createElement('canvas'),
  currentState: null,
  draw(state = Texture.currentState) {
    Texture.currentState = state

    if (!state.predictions || !state.predictions.length) {
      return
    }

    const ctx = Texture.canvas.getContext('2d')

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
      300,
      350
    )
  },
  init(state) {
    Texture.currentState = state

    Texture.canvas.setAttribute('width', 300)
    Texture.canvas.setAttribute('height', 350)
  },
}

export default Texture
