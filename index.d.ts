import {BrowserWindow} from 'electron';

declare namespace electronDebug {
	interface Options {
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
	}
}

declare const electronDebug: {
	/**
	Install keyboard shortcuts and optionally activate DevTools on each created `BrowserWindow`.

	@example
	```
	import {app, BrowserWindow} from 'electron';
	import debug = require('electron-debug');

	debug();

	let mainWindow;
	(async () => {
		await app.whenReady();
		mainWindow = new BrowserWindow();
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
};

export = electronDebug;
