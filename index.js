'use strict';
const electron = require('electron');
const localShortcut = require('electron-localshortcut');
const isDev = require('electron-is-dev');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isOSX = process.platform === 'darwin';

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

module.exports = opts => {
	opts = Object.assign({
		enabled: true,
		showDevTools: false,
		extensions: {},
	}, opts);

	if (!opts.enabled || !isDev) {
		return;
	}

	app.on('browser-window-created', (e, win) => {
		if (opts.showDevTools) {
			openDevTools(win, opts.showDevTools);
		}
	});

	app.on('ready', () => {
		Object.keys(opts.extensions).forEach((name) => {
			BrowserWindow.removeDevToolsExtension(name);
			if (opts.extensions[name]) {
				BrowserWindow.addDevToolsExtension(opts.extensions[name]);
			}
		});
		localShortcut.register(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
		localShortcut.register('F12', devTools);

		localShortcut.register('CmdOrCtrl+R', refresh);
		localShortcut.register('F5', refresh);
	});
};

module.exports.refresh = refresh;
module.exports.devTools = devTools;
module.exports.openDevTools = openDevTools;
