import './instructions.scss'

const DURATION_MS = 10000

const Instructions = {
  render() {
    const domElement = document.createElement('div')

    domElement.classList.add('instructions')

    domElement.innerHTML = `
            <p>Welcome!</p>
            <p>Make sure your webcam is connected and you give this website permission to use it.</p>
            <p>To open camera selection press 'S' on your keyboard. It will show up in the top right corner.</p>
            <p>Show your face to the camera. It will be detected, tracked and displayed here with visual distortions.</p>
            <p>The application may malfunction if more than one face is present in front of the camera.</p>
            <p>In case of a hiccup, refresh!</p>
            <div class="progress-bar"></div>
        `

    document.body.appendChild(domElement)

    setTimeout(() => {
      document.getElementsByClassName('progress-bar')[0].classList.add('shrink')
    }, 1000)

    setTimeout(() => {
      domElement.classList.add('fade-out')
    }, DURATION_MS)
  },
}

export default Instructions
