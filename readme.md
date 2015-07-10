# electron-debug

> Adds useful debug features to your [Electron](http://electron.atom.io) app

Ideas for more debug features [welcome!](https://github.com/sindresorhus/electron-debug/issues/new)


## Features

### Dev Tools

Toggle Dev Tools.

- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd>

### Reload

Force reload the window.

- OS X: <kbd>Cmd</kbd> <kbd>I</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>I</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>I</kbd>


## Install

```
$ npm install --save electron-debug
```


## Usage

```js
require('electron-debug')();

let win;

app.on('ready', function () {
	win = new BrowserWindow({});
});
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
