# electron-debug

> Adds useful debug features to your [Electron](https://electronjs.org) app


## Features

### DevTools

Toggle DevTools.

- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

### Reload

Force reload the window.

- macOS: <kbd>Cmd</kbd> <kbd>R</kbd> or <kbd>F5</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>R</kbd> or <kbd>F5</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>R</kbd> or <kbd>F5</kbd>

### Element Inspector

Open DevTools and focus the Element Inspector tool.

- macOS: <kbd>Cmd</kbd> <kbd>Shift</kbd> <kbd>C</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>C</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>C</kbd>

### Activates DevTools extensions

Just install any of these extension and they'll be activated for you:

- [devtron](https://electronjs.org/devtron) - The official Electron DevTools extension
- [electron-react-devtools](https://github.com/firejune/electron-react-devtools) - React DevTools extension for Electron


## Install

```
$ npm install electron-debug
```

*Requires Electron 5 or later.*


## Usage

```js
const {app, BrowserWindow} = require('electron');
const debug = require('electron-debug');

debug();

let mainWindow;
(async () => {
	await app.whenReady();
	mainWindow = new BrowserWindow();
})();
```


## API

Only runs when in [development](https://github.com/sindresorhus/electron-is-dev), unless overridden by the `isEnabled` option. So no need to guard it for production.

### electronDebug([options])

Install keyboard shortcuts and optionally activate DevTools on each created `BrowserWindow`.

#### options

Type: `object`

##### isEnabled

Type: `boolean`

##### showDevTools

Type: `boolean`<br>
Default: `true`

Show DevTools on each created `BrowserWindow`.

##### devToolsMode

Type: `string`<br>
Default: `'previous'`<br>
Values: `'undocked'` `'right'` `'bottom'` `'previous'` `'detach'`

The dock state to open DevTools in.

### devTools([window])

Toggle DevTools for the specified `BrowserWindow` instance or the focused one.

#### window

Type: `BrowserWindow`<br>
Default: The focused `BrowserWindow`

### refresh([window])

Reload the specified `BrowserWindow` instance or the focused one.

#### window

Type: `BrowserWindow`<br>
Default: The focused `BrowserWindow`

### openDevTools([window])

Open DevTools for the specified `BrowserWindow` instance or the focused one.

#### window

Type: `BrowserWindow`<br>
Default: The focused `BrowserWindow`


## Related

- [electron-util](https://github.com/sindresorhus/electron-util) - Useful utilities for developing Electron apps and modules
- [electron-store](https://github.com/sindresorhus/electron-store) - Save and load data like user preferences, app state, cache, etc
- [electron-context-menu](https://github.com/sindresorhus/electron-context-menu) - Context menu for your Electron app
- [electron-dl](https://github.com/sindresorhus/electron-dl) - Simplified file downloads for your Electron app
- [electron-unhandled](https://github.com/sindresorhus/electron-unhandled) - Catch unhandled errors and promise rejections in your Electron app
- [electron-reloader](https://github.com/sindresorhus/electron-reloader) - Simple auto-reloading for Electron apps during development
- [electron-serve](https://github.com/sindresorhus/electron-serve) - Static file serving for Electron apps
- [debug-menu](https://github.com/parro-it/debug-menu) - Chrome-like debug context-menu for Electron
