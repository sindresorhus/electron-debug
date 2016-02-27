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

require('electron-debug')({
	showDevTools: true
});

let win;

app.on('ready', () => {
	win = new BrowserWindow({
		width: 800,
		height: 600
	});
});
```

## API

### Default exported function

```js
electronDebug([showDevTools]);
```

Install keyboard shortcuts and optionally activate DevTools on each created `BrowserWindow`.

#### Options

* showDevTools

Type: `boolean`  
Default: `false`

Show DevTools on each created `BrowserWindow`.


### devTools

```js
electronDebug.devTools([win]);
```

Toggle DevTools for specified `BrowserWindow` instance or for focused one if not specified.

#### Options

* win

Type: `BrowserWindow`  
Default: `undefined`

The `BrowserWindow` instance to toggle DevTools for.


### refresh

```js
electronDebug.refresh([win]);
```

Reload specified `BrowserWindow` instance or focused one if not specified.

#### Options

* win

Type: `BrowserWindow`  
Default: `undefined`

The `BrowserWindow` instance to reload.



## Related

- [debug-menu](https://github.com/parro-it/debug-menu) - Chrome-like debug context-menu for Electron


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
