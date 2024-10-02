import process from 'node:process';
import {app, BrowserWindow} from 'electron';
import localShortcut from 'electron-localshortcut';
import isDev from 'electron-is-dev';

const isMacOS = process.platform === 'darwin';

// A Map allows each window to have its own options
const developmentToolsOptions = new Map();

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

function registerAccelerators(win = BrowserWindow.getFocusedWindow()) {
	(async () => {
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
	})();
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
		/// Workaround for https://github.com/electron/electron/issues/12438
		win.webContents.once('dom-ready', () => {
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
	});
}
