export interface Options {
	/**
	 * Default: [Only in development](https://github.com/sindresorhus/electron-is-dev)
	 */
	enabled?: boolean;

	/**
	 * Show DevTools on each created `BrowserWindow`.
	 *
	 * @default true
	 */
	showDevTools?: boolean;

	/**
	 * The dock state to open DevTools in.
	 *
	 * @default 'undocked'
	 */
	devToolsMode?: 'undocked' | 'right' | 'bottom' | 'previous' | 'detach';
}

/**
 * Install keyboard shortcuts and optionally activate DevTools on each created `BrowserWindow`.
 *
 * @example
 *
 * import {app, BrowserWindow} from 'electron';
 * import electronDebug from 'electron-debug';
 *
 * electronDebug();
 *
 * let win;
 * (async () => {
 * 	await app.whenReady();
 * 	win = new BrowserWindow();
 * });
 */
export default function electronDebug(options?: Options): void;

/**
 * Reload the specified `BrowserWindow` instance or the focused one.
 *
 * @param window - Default: BrowserWindow.getFocusedWindow()
 */
export function refresh(window?: Electron.BrowserWindow): void;

/**
 * Toggle DevTools for the specified `BrowserWindow` instance or the focused one.
 *
 * @param window - Default: BrowserWindow.getFocusedWindow()
 */
export function devTools(window?: Electron.BrowserWindow): void;

/**
 * Open DevTools for the specified `BrowserWindow` instance or the focused one.
 *
 * @param window - Default: BrowserWindow.getFocusedWindow()
 */
export function openDevTools(window?: Electron.BrowserWindow): void;
