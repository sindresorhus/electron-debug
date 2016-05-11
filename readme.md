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

### Activates Devtron

[Devtron](http://electron.atom.io/devtron/) is the official Electron DevTools extension.

Just install it in your app and we'll activate it for you.

```
$ npm install --save-dev devtron
```


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

Type: `boolean` `string`<br>
Default: `false`<br>
Values: `'right'` `'bottom'` `'undocked'` `false` `true` *(last dock state)*

Show DevTools on each created `BrowserWindow`.

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

Type: `boolean` `string`<br>
Default: `false`<br>
Values: `'right'` `'bottom'` `'undocked'` `false` `true` *(last dock state)*

Show DevTools on each created `BrowserWindow`.


## Related

- [electron-is-dev](https://github.com/sindresorhus/electron-is-dev) - Check if Electron is running in development
- [debug-menu](https://github.com/parro-it/debug-menu) - Chrome-like debug context-menu for Electron


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
