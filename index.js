import process from 'node:process';
import {app, BrowserWindow} from 'electron';
import localShortcut from 'electron-localshortcut';
import isDev from 'electron-is-dev';

const isMacOS = process.platform === 'darwin';

// A Map allows each window to have its own options
const developmentToolsOptions = new Map();
const configuredWindows = new WeakSet();
const pendingWindows = new WeakSet();
const windowsWithRendererCreatedWindowHandler = new WeakSet();

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

function registerRendererCreatedWindowHandler(win, options) {
	if (windowsWithRendererCreatedWindowHandler.has(win)) {
		return;
	}

	windowsWithRendererCreatedWindowHandler.add(win);
	win.webContents.on('did-create-window', childWindow => {
		configureWindow(childWindow, options);
	});
}

function configureWindow(win, options) {
	registerRendererCreatedWindowHandler(win, options);

	if (pendingWindows.has(win) || configuredWindows.has(win)) {
		return;
	}

	pendingWindows.add(win);

	/// Workaround for https://github.com/electron/electron/issues/12438
	win.webContents.once('dom-ready', () => {
		pendingWindows.delete(win);

		if (configuredWindows.has(win)) {
			return;
		}

		configuredWindows.add(win);
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
			// With filters, accelerators are defined for each window depending on their provided options
			registerAccelerators(win);
		}

		if (winOptions.showDevTools) {
			openDevTools(win);
		}
	});
}

async function registerAccelerators(win = BrowserWindow.getFocusedWindow()) {
	await app.whenReady();

	if (win) {
		localShortcut.register(win, 'CommandOrControl+Shift+C', inspectElements);
		localShortcut.register(win, isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', devTools);
		localShortcut.register(win, 'F12', devTools);
		localShortcut.register(win, 'CommandOrControl+R', refresh);
		localShortcut.register(win, 'F5', refresh);
	} else {
		localShortcut.register('CommandOrControl+Shift+C', inspectElements);
		localShortcut.register(isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', devTools);
		localShortcut.register('F12', devTools);
		localShortcut.register('CommandOrControl+R', refresh);
		localShortcut.register('F5', refresh);
	}
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

function inspectElements() {
	const win = BrowserWindow.getFocusedWindow();
	const inspect = () => {
		win.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');
	};

	if (win) {
		if (win.webContents.isDevToolsOpened()) {
			inspect();
		} else {
			win.webContents.once('devtools-opened', inspect);
			win.openDevTools();
		}
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

		// When there's no filter, accelerators are defined globally
		registerAccelerators();
	}

	app.on('browser-window-created', (event, win) => {
		configureWindow(win, options);
	});
}
