const path = require('path')
const { Application } = require('spectron')

const appPath = () => {
  switch (process.platform) {
    case 'darwin':
      return path.join(__dirname, '..', '.tmp', 'mac', 'TrackerElectron.app', 'Contents', 'MacOS', 'TrackerElectron')
    case 'linux':
      return path.join(__dirname, '..', '.tmp', 'linux', 'TrackerElectron')
    case 'win32':
      return path.join(__dirname, '..', '.tmp', 'win-unpacked', 'TrackerElectron.exe')
    default:
      throw Error(`Unsupported platform ${process.platform}`)
  }
}
global.app = new Application({ path: appPath() })
