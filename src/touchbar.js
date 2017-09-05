// eslint-disable-next-line import/no-extraneous-dependencies
const { TouchBar, nativeImage } = require('electron');
const path = require('path');


let mainWindow;
let icon = nativeImage.createFromPath(path.join(__dirname, '../assets/icons/bb8.png'));
icon = icon.resize({ width: 32, height: 32 });

const {
  TouchBarLabel,
  TouchBarSpacer,
  TouchBarColorPicker,
  TouchBarSlider,
  TouchBarPopover
} = TouchBar;

const colorPicker = new TouchBarColorPicker({
  change: (color) => {
    if (mainWindow) {
      mainWindow.webContents.send('bb8:color', color);
    }
  }
});

const popover = new TouchBarPopover({
  label: 'Roll',
  icon,
  items: [
    new TouchBarSlider({
      label: 'Roll Me',
      change: (newValue) => {
        mainWindow.webContents.send('bb8:roll', newValue);
      },
      minValue: 0,
      maxValue: 360
    })
  ]
});

const touchBar = new TouchBar([
  new TouchBarLabel({ label: 'BB-8 Controller' }),
  new TouchBarSpacer({ size: 'small' }),
  popover,
  new TouchBarSpacer({ size: 'small' }),
  colorPicker
], null);

const loadTouchBar = (window) => {
  mainWindow = window;
  window.setTouchBar(touchBar);
};

module.exports = {
  loadTouchBar
};
