import {type BrowserWindow} from 'electron';

export type Options = {
	/**
	Default: [Only in development](https://github.com/sindresorhus/electron-is-dev)
	*/
	readonly isEnabled?: boolean;

	/**
	Show DevTools on each created `BrowserWindow`.

	@default true
	*/
	readonly showDevTools?: boolean;

	/**
	The dock state to open DevTools in.

	@default 'previous'
	*/
	readonly devToolsMode?:
	| 'undocked'
	| 'right'
	| 'bottom'
	| 'previous'
	| 'detach';
};

/**
Install keyboard shortcuts and optionally activate DevTools on each created `BrowserWindow`.

@example
```
import {app, BrowserWindow} from 'electron';
import debug from 'electron-debug';

debug();

let mainWindow;
(async () => {
	await app.whenReady();
	mainWindow = new BrowserWindow();
});
```
*/
export default function debug(options?: Options): void;

/**
Reload the specified `BrowserWindow` instance or the focused one.

@param window - Default: `BrowserWindow.getFocusedWindow()`
*/
export function refresh(window?: BrowserWindow): void;

/**
Toggle DevTools for the specified `BrowserWindow` instance or the focused one.

@param window - Default: `BrowserWindow.getFocusedWindow()`
*/
// eslint-disable-next-line unicorn/prevent-abbreviations
export function devTools(window?: BrowserWindow): void;

/**
Open DevTools for the specified `BrowserWindow` instance or the focused one.

@param window - Default: `BrowserWindow.getFocusedWindow()`
*/
// eslint-disable-next-line unicorn/prevent-abbreviations
export function openDevTools(window?: BrowserWindow): void;
