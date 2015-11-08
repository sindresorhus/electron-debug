# electron-debug

> Adds useful debug features to your [Electron](http://electron.atom.io) app

Ideas for more debug features [welcome!](https://github.com/sindresorhus/electron-debug/issues/new)


## Features

### Dev Tools

Toggle Dev Tools.

- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

### Reload

Force reload the window.

- OS X: <kbd>Cmd</kbd> <kbd>R</kbd> or <kbd>F5</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>R</kbd> or <kbd>F5</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>R</kbd> or <kbd>F5</kbd>


## Install

```
$ npm install --save electron-debug
```


## Usage

```js
var app = require('app');

require('electron-debug')({
  showDevTools: true
});

let win;

app.on('ready', function () {
  win = new BrowserWindow({
    width: 800,
    height: 600
  });
});
```

### Options

#### showDevTools

If true, DevTools will be open when app has been started.

## Related

- [debug-menu](https://github.com/parro-it/debug-menu) - Chromium-like debug context-menu for [Electron](http://electron.atom.io)


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)


