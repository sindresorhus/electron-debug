'use strict';
const electron = require('electron');
const localShortcut = require('electron-localshortcut');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isOSX = process.platform === 'darwin';

function devTools(win) {
	win = win || BrowserWindow.getFocusedWindow();

	if (win) {
		win.toggleDevTools();
	}
}

function refresh() {
	const win = BrowserWindow.getFocusedWindow();

	if (win) {
		win.webContents.reloadIgnoringCache();
	}
}

module.exports = opts => {
	opts = opts || {};

	app.on('browser-window-created', (e, win) => {
		if (opts.showDevTools) {
			devTools(win);
		}
	});

	app.on('ready', () => {
		localShortcut.register(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
		localShortcut.register('F12', devTools);

		localShortcut.register('CmdOrCtrl+R', refresh);
		localShortcut.register('F5', refresh);
	});
};
