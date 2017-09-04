// eslint-disable-next-line import/no-extraneous-dependencies
const electron = require('electron');
const pjson = require('../package.json');
const path = require('path');
const { loadTouchBar } = require('./touchbar');

const {
  app,
  BrowserWindow,
  Menu
} = electron;

let mainWindow;

const createMenu = () => {
  const template = [];
  if (process.platform === 'darwin') {
    template.push({
      label: pjson.displayName,
      submenu: [
        {
          role: 'quit',
          label: 'Quit'
        }
      ]
    });

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    autoHideMenuBar: true,
    title: pjson.displayName,
    icon: path.join(__dirname, '../assets/icons/bb8.png')
  });

  // and load the index.html of the app.
  mainWindow.loadURL('https://bb8.varunkumar.me');

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('ping', 'whoooooooh!');
  });

  // create menu
  createMenu();

  // create touchbar
  loadTouchBar(mainWindow);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const bootstrapApp = () => {
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
    if (mainWindow === null) {
      createWindow();
    }
  });
};

bootstrapApp();
