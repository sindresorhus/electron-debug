import process from 'node:process';
import {app, BrowserWindow} from 'electron';
import isDev from 'electron-is-dev';

const isMacOS = process.platform === 'darwin';

// A Map allows each window to have its own options
const developmentToolsOptions = new Map();

// The windows that already have the shortcut handler attached
const registeredWindows = new WeakSet();

/**
The keyboard shortcuts and the accelerator each one responds to.

The accelerator for the current platform is picked here, so `matchesAccelerator` only has to compare.
*/
const shortcuts = [
	{accelerator: isMacOS ? 'Command+Shift+C' : 'Control+Shift+C', callback: inspectElements},
	{accelerator: isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', callback: devTools},
	{accelerator: 'F12', callback: devTools},
	{accelerator: isMacOS ? 'Command+R' : 'Control+R', callback: refresh},
	{accelerator: 'F5', callback: refresh},
];

function toggleDevelopmentTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		const {webContents} = win;
		if (webContents.isDevToolsOpened()) {
			webContents.closeDevTools();
		} else {
			webContents.openDevTools(developmentToolsOptions.get(win));
		}
	}
}

function shouldRun(options) {
	return options && (options.isEnabled === true || (options.isEnabled === null && isDev));
}

function getOptionsForWindow(win, options) {
	if (!options.windowSelector) {
		return options;
	}

	const newOptions = options.windowSelector(win);

	return newOptions === true
		? options
		: (newOptions === false
			? {isEnabled: false}
			: {...options, ...newOptions});
}

/**
Check whether a key input matches an accelerator, for example `Command+Shift+C`. Every modifier the accelerator lists must be held, and no other modifier may be.
*/
function matchesAccelerator(accelerator, input) {
	const parts = accelerator.split('+');
	const key = parts.pop();
	const code = /^F\d+$/.test(key) ? key : `Key${key}`;

	// `code` is the physical key and `key` is what it types, so accept either to support other keyboard layouts
	return (input.code === code || input.key.toLowerCase() === key.toLowerCase())
		&& input.shift === parts.includes('Shift')
		&& input.alt === parts.includes('Alt')
		&& input.meta === parts.includes('Command')
		&& input.control === parts.includes('Control');
}

/**
Register the keyboard shortcuts on a window.

The keys are handled here rather than by a shortcut package so that `event.preventDefault()` can be called. Without it, the default Electron menu also handles its own accelerator for the same keys, so the shortcut runs twice.
*/
function registerShortcuts(win) {
	if (registeredWindows.has(win)) {
		return;
	}

	registeredWindows.add(win);

	win.webContents.on('before-input-event', (event, input) => {
		if (input.type !== 'keyDown') {
			return;
		}

		const matched = shortcuts.find(shortcut => matchesAccelerator(shortcut.accelerator, input));

		if (matched) {
			event.preventDefault();
			matched.callback(win);
		}
	});
}

/**
Register the keyboard shortcuts on every window, including the windows created later.
*/
function registerShortcutsOnAllWindows() {
	for (const win of BrowserWindow.getAllWindows()) {
		registerShortcuts(win);
	}

	app.on('browser-window-created', (event, win) => {
		registerShortcuts(win);
	});
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export function devTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		toggleDevelopmentTools(win);
	}
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export function openDevTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		win.webContents.openDevTools(developmentToolsOptions.get(win));
	}
}

export function refresh(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		win.webContents.reloadIgnoringCache();
	}
}

function inspectElements(win = BrowserWindow.getFocusedWindow()) {
	if (!win) {
		return;
	}

	const inspect = () => {
		win.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');
	};

	if (win.webContents.isDevToolsOpened()) {
		inspect();
	} else {
		win.webContents.once('devtools-opened', inspect);
		openDevTools(win);
	}
}

export default function debug(options) {
	options = {
		isEnabled: null,
		showDevTools: true,
		devToolsMode: 'previous',
		...options,
	};

	if (!options.windowSelector) {
		if (!shouldRun(options)) {
			return;
		}

		// When there's no filter, the shortcuts are defined globally
		registerShortcutsOnAllWindows();
	}

	app.on('browser-window-created', (event, win) => {
		/// Workaround for https://github.com/electron/electron/issues/12438
		win.webContents.once('dom-ready', () => {
			applyOptionsToWindow(win, options);
		});
	});

	// A window that already exists may have fired `dom-ready` already, so it cannot wait for it
	for (const win of BrowserWindow.getAllWindows()) {
		applyOptionsToWindow(win, options);
	}
}

/**
Apply the options to a window. Split out from the `browser-window-created` handler so windows that already exist when `debug()` is called get the same treatment.
*/
function applyOptionsToWindow(win, options) {
	const winOptions = getOptionsForWindow(win, options);

	if (winOptions.devToolsMode !== 'previous') {
		developmentToolsOptions.set(win, {
			...developmentToolsOptions.get(win),
			mode: winOptions.devToolsMode,
		});
	}

	if (!shouldRun(winOptions)) {
		return;
	}

	if (winOptions.windowSelector) {
		// With filters, the shortcuts are defined for each window depending on their provided options
		registerShortcuts(win);
	}

	if (winOptions.showDevTools) {
		openDevTools(win);
	}
}
