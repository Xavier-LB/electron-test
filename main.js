const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { autoUpdater, AppUpdater } = require('electron-updater')

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html').then(() => { mainWindow.webContents.send('app-version', app.getVersion()); })

  mainWindow.webContents.openDevTools({ mode: 'bottom' })

  // show update dialog
  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-available', info)
    console.log('update-available', info);
    let pth = autoUpdater.downloadUpdate();
    console.log('pth', pth);

  })

  autoUpdater.on("update-not-available", (info) => {
    mainWindow.webContents.send('update-not-available', info)
    console.log('update-not-available', info);
  });

  autoUpdater.on("download-progress", (info) => {
    mainWindow.webContents.send('update-downloaded', info)
    console.log('update-downloaded', info);
  });

  autoUpdater.on("update-downloaded", (info) => {
    mainWindow.webContents.send('update-downloaded', info)
    console.log('update-downloaded', info);
    autoUpdater.quitAndInstall();
    // app.quit();
  });

  autoUpdater.on("error", (info) => {
    mainWindow.webContents.send('error-update', info)
    console.log('error-update', info);
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  try {
    autoUpdater.checkForUpdates()
  } catch (error) {
    console.error('Error checking for updates:', error.message);
  }
})
ipcMain.on('run-update', () => {
  autoUpdater.quitAndInstall();
  console.log('Run update (main)');
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

