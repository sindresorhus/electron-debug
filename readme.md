# electron-debug

> Adds useful debug features to your [Electron](http://electron.atom.io) app

Ideas for more debug features [welcome!](https://github.com/sindresorhus/electron-debug/issues/new)


## Features

### Dev Tools

Toggle Dev Tools.

- OS X: `Cmd+Alt+I`
- Linux: `Ctrl+Shift+I`
- Windows: `Ctrl+Shift+I`

### Reload

Force reload the window.

- OS X: `Cmd+R`
- Linux: `Ctrl+R`
- Windows: `Ctrl+R`


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
