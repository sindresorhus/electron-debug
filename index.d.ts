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
	| 'left'
	| 'right'
	| 'bottom'
	| 'previous'
	| 'detach';

	/**
	Specify customized options for each window.

	The accepted function receives the window to apply the filter or new options to.
	It must return one of these values:

	- `true`: To enable debug with the global options for the given window.
	- `false`: Disable debug for the given window (same as returning `{isEnabled: false}`).
	- `Partial<Options>`: Object to override global options just for the given window. It does a shallow merge.

	@default () => true
	@example
	```
	import debug from 'electron-debug';

	debug({
		windowSelector: window => window.title !== 'Debug tools',
	});
	```
	*/
	windowSelector?: (window: Readonly<BrowserWindow>) => boolean | Partial<Options>;
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
