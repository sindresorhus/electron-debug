import process from 'node:process';
import {app, BrowserWindow} from 'electron';
import localShortcut from 'electron-localshortcut';
import isDev from 'electron-is-dev';

const isMacOS = process.platform === 'darwin';

const developmentToolsOptions = {};

function toggleDevelopmentTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		const {webContents} = win;
		if (webContents.isDevToolsOpened()) {
			webContents.closeDevTools();
		} else {
			webContents.openDevTools(developmentToolsOptions);
		}
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
		win.webContents.openDevTools(developmentToolsOptions);
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

	if (options.isEnabled === false || (options.isEnabled === null && !isDev)) {
		return;
	}

	if (options.devToolsMode !== 'previous') {
		developmentToolsOptions.mode = options.devToolsMode;
	}

	app.on('browser-window-created', (event, win) => {
		if (options.showDevTools) {
			/// Workaround for https://github.com/electron/electron/issues/12438
			win.webContents.once('dom-ready', () => {
				openDevTools(win, options.showDevTools, false);
			});
		}
	});

	(async () => {
		await app.whenReady();

		localShortcut.register('CommandOrControl+Shift+C', inspectElements);
		localShortcut.register(isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', devTools);
		localShortcut.register('F12', devTools);
		localShortcut.register('CommandOrControl+R', refresh);
		localShortcut.register('F5', refresh);
	})();
}
