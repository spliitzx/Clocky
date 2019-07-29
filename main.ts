import { app, BrowserWindow, screen, ipcRenderer, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

autoUpdater.logger = log;
log.transports.file.level = 'debug';

checkForUpdates();
setInterval(() => checkForUpdates(), 60000);

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
    minHeight: 900,
    minWidth: 1700
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

async function checkForUpdates() {
  log.info('Checking for updates...');
  try {
    await autoUpdater.checkForUpdates();
  } catch (e) {
    log.info(e);
    win.webContents.send('update-error', {});
  }
}

autoUpdater.on('update-available', () => {
  log.info('Update available, sending to client...');
  win.webContents.send('update-available', {});
});

autoUpdater.on('update-not-available', () => {
  log.info('No update available.');
  win.webContents.send('update-not-available', {});
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded.');
  win.webContents.send('update-downloaded', {});
  setTimeout(() => {
    autoUpdater.quitAndInstall(false);
  }, 2000);
});
