const Settings = {
    rootEl: document.createElement('aside'),
    state: null,
    visible: false,
    async init(state) {
        Settings.state = state

        const devices = await navigator.mediaDevices.enumerateDevices()
        await Settings.setCamera(devices.filter((device) => device.kind === 'videoinput')[0].deviceId)

        const cameraOptions = await renderCameraOptions(devices)
        Settings.rootEl.innerHTML = `
            <select>
                <option value="" disabled selected>Camera</option>
                ${cameraOptions}
            </select>
        `
        Settings.rootEl.getElementsByTagName('select')[0].addEventListener('change', Settings.handleCameraChange)

        document.body.appendChild(Settings.rootEl)
    },
    handleCameraChange: (e) => {
        Settings.setCamera(e.target.value)
    },
    handleKeyDown: (e) => {

    },
    setCamera: async (deviceId) => {
        Settings.state.camera = deviceId
        Settings.state.stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: Settings.state.camera }})
        Settings.state.imageCapture = new ImageCapture(Settings.state.stream.getVideoTracks()[0])
    }
}

async function renderCameraOptions(devices) {
    return devices
    .filter((device) => device.kind === 'videoinput')
    .map((device) => `<option value="${device.deviceId}" ${Settings.state.camera === device.deviceId ? 'selected' : ''}>${device.label}</option>`)
    .join('')
}

export default Settings