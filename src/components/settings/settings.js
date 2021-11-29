import './settings.scss'

const VIDEO_WIDTH = 320
const VIDEO_HEIGHT = 240

const Settings = {
  rootEl: document.createElement('aside'),
  state: null,
  isOpen: false,
  async init(state) {
    Settings.state = state

    const devices = await navigator.mediaDevices.enumerateDevices()
    const deviceId = localStorage.getItem('deviceId') || devices.filter((device) => device.kind === 'videoinput')[0].deviceId
    await Settings.setCamera(deviceId)

    const cameraOptions = await renderCameraOptions(devices)
    Settings.rootEl.innerHTML = `
            <select>
                <option value="" disabled selected>Camera selection</option>
                ${cameraOptions}
            </select>
        `
    Settings.rootEl
      .getElementsByTagName('select')[0]
      .addEventListener('change', Settings.handleCameraChange)

    Settings.rootEl.classList.add('settings')

    if (Settings.isOpen) {
      Settings.rootEl.classList.add('is-open')
    }

    document.body.appendChild(Settings.rootEl)

    document.addEventListener('keyup', Settings.handleKeyUp)
  },
  handleCameraChange: (e) => {
    Settings.setCamera(e.target.value)
  },
  handleKeyUp: (e) => {
    if (e.keyCode === 83) {
      if (Settings.isOpen) {
        Settings.rootEl.classList.remove('is-open')
        Settings.isOpen = false;
      } else {
        Settings.rootEl.classList.add('is-open')
        Settings.isOpen = true;
      }
    }
  },
  setCamera: async (deviceId) => {
    Settings.state.camera = deviceId
    localStorage.setItem('deviceId', deviceId)
    Settings.state.stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: Settings.state.camera, width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
    })
    Settings.state.imageCapture = new ImageCapture(
      Settings.state.stream.getVideoTracks()[0]
    )
  },
}

async function renderCameraOptions(devices) {
  return devices
    .filter((device) => device.kind === 'videoinput')
    .map(
      (device) =>
        `<option value="${device.deviceId}" ${
          Settings.state.camera === device.deviceId ? 'selected' : ''
        }>${device.label}</option>`
    )
    .join('')
}

export default Settings
