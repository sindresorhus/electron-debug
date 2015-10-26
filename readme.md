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

### Inspect element

Right-click on an HTML element when DevTools is open to inspect it.


## Install

```
$ npm install --save electron-debug
```


## Usage

```js
var app = require('app');

require('electron-debug')();

let win;

app.on('ready', function () {
	win = new BrowserWindow({
		width: 800,
		height: 600
	});
});
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
