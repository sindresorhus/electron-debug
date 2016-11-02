'use strict';
const electron = require('electron');
const localShortcut = require('electron-localshortcut');
const isDev = require('electron-is-dev');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isMacOS = process.platform === 'darwin';

function devTools(win) {
	win = win || BrowserWindow.getFocusedWindow();

	if (win) {
		win.toggleDevTools();
	}
}

function openDevTools(win, showDevTools) {
	win = win || BrowserWindow.getFocusedWindow();

	if (win) {
		const mode = showDevTools === true ? undefined : showDevTools;
		win.webContents.openDevTools({mode});
	}
}

function refresh(win) {
	win = win || BrowserWindow.getFocusedWindow();

	if (win) {
		win.webContents.reloadIgnoringCache();
	}
}

function inspectElements() {
	const win = BrowserWindow.getFocusedWindow();

	if (win) {
		if (win.webContents.isDevToolsOpened()) {
			win.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');
		} else {
			win.webContents.on('devtools-opened', function () {
				win.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');
			})
			win.openDevTools();
		}
	}
}

module.exports = opts => {
	opts = Object.assign({
		enabled: null,
		showDevTools: false
	}, opts);

	if (opts.enabled === false || (opts.enabled === null && !isDev)) {
		return;
	}

	app.on('browser-window-created', (e, win) => {
		if (opts.showDevTools) {
			openDevTools(win, opts.showDevTools);
		}
	});

	app.on('ready', () => {
		// activate devtron for the user if they have it installed and it's not already added
		try {
			const devtronAlreadyAdded = BrowserWindow.getDevToolsExtensions &&
				{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), 'devtron');

			if (!devtronAlreadyAdded) {
				BrowserWindow.addDevToolsExtension(require('devtron').path);
			}
		} catch (err) {}

		if (isMacOS) {
			localShortcut.register('Cmd+Shift+C', inspectElements);
			localShortcut.register('Cmd+Alt+C', inspectElements);
		} else {
			localShortcut.register('Ctrl+Shift+C', inspectElements);
		}

		localShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
		localShortcut.register('F12', devTools);

		localShortcut.register('CmdOrCtrl+R', refresh);
		localShortcut.register('F5', refresh);
	});
};

module.exports.refresh = refresh;
module.exports.devTools = devTools;
module.exports.openDevTools = openDevTools;
