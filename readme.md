# electron-debug

> Adds useful debug features to your [Electron](http://electron.atom.io) app

Ideas for more debug features [welcome!](https://github.com/sindresorhus/electron-debug/issues/new)


## Features

### DevTools

Toggle DevTools.

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
const {app, BrowserWindow} = require('electron');

require('electron-debug')({showDevTools: true});

let win;

app.on('ready', () => {
	win = new BrowserWindow({
		width: 800,
		height: 600
	});
});
```


## API

Only runs when in [development](https://github.com/sindresorhus/electron-is-dev), unless overridden by the `enabled` option. So no need to guard it for production.

### electronDebug([options])

Install keyboard shortcuts and optionally activate DevTools on each created `BrowserWindow`.

#### options

##### enabled

Type: `boolean`<br>

##### showDevTools

Type: `boolean`<br>
Default: `false`

Show DevTools on each created `BrowserWindow`.

Can take one of the `mode` values allowed by [webContents.openDevTools](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#webcontentsopendevtoolsoptions) method to specify DevTools state:

 * "right"
 * "bottom"
 * "undocked"
 * "detach"
 * true - last used DevTools dock state.


### devTools([window])

Toggle DevTools for the specified `BrowserWindow` instance or the focused one.

#### window

Type: `BrowserWindow`<br>
Default: the focused `BrowserWindow`

### refresh([window])

Reload the specified `BrowserWindow` instance or the focused one.

#### window

Type: `BrowserWindow`<br>
Default: the focused `BrowserWindow`

### openDevTools([window], [showDevTools])

Open DevTools for the specified `BrowserWindow` instance or the focused one.

#### window

Type: `BrowserWindow`<br>
Default: the focused `BrowserWindow`

#### showDevTools

The DevTools state to use. Can take one of the `mode` values allowed by [webContents.openDevTools](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#webcontentsopendevtoolsoptions) method:

 * "right"
 * "bottom"
 * "undocked"
 * "detach"
 * true - last used DevTools dock state.


## Related

- [electron-is-dev](https://github.com/sindresorhus/electron-is-dev) - Check if Electron is running in development
- [debug-menu](https://github.com/parro-it/debug-menu) - Chrome-like debug context-menu for Electron


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
