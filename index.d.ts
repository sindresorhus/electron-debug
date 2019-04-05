import {BrowserWindow} from 'electron';

declare namespace electronDebug {
	interface Options {
		/**
		Default: [Only in development](https://github.com/sindresorhus/electron-is-dev)
		*/
		readonly enabled?: boolean;

		/**
		Show DevTools on each created `BrowserWindow`.

		@default true
		*/
		readonly showDevTools?: boolean;

		/**
		The dock state to open DevTools in.

		@default 'undocked'
		*/
		readonly devToolsMode?:
			| 'undocked'
			| 'right'
			| 'bottom'
			| 'previous'
			| 'detach';
	}
}

declare const electronDebug: {
	/**
	Install keyboard shortcuts and optionally activate DevTools on each created `BrowserWindow`.

	@example
	```
	import {app, BrowserWindow} from 'electron';
	import electronDebug = require('electron-debug');

	electronDebug();

	let win;
	(async () => {
		await app.whenReady();
		win = new BrowserWindow();
	});
	```
	*/
	(options?: electronDebug.Options): void;

	/**
	Reload the specified `BrowserWindow` instance or the focused one.

	@param window - Default: `BrowserWindow.getFocusedWindow()`
	*/
	refresh(window?: BrowserWindow): void;

	/**
	Toggle DevTools for the specified `BrowserWindow` instance or the focused one.

	@param window - Default: `BrowserWindow.getFocusedWindow()`
	*/
	devTools(window?: BrowserWindow): void;

	/**
	Open DevTools for the specified `BrowserWindow` instance or the focused one.

	@param window - Default: `BrowserWindow.getFocusedWindow()`
	*/
	openDevTools(window?: BrowserWindow): void;

	// TODO: Remove this for the next major release
	default: typeof electronDebug;
};

export = electronDebug;
