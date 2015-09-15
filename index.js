'use strict';
const app = require('app');
const globalShortcut = require('global-shortcut');
const BrowserWindow = require('browser-window');
const isOSX = process.platform === 'darwin';

function devTools() {
	var win = BrowserWindow.getFocusedWindow();

	if (win) {
		win.toggleDevTools();
	}
}

function refresh() {
	var win = BrowserWindow.getFocusedWindow();

	if (win) {
		win.reloadIgnoringCache();
	}
}

module.exports = function () {
	app.on('ready', function () {
		app.on('browser-window-focus', function () {
			globalShortcut.register(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
			globalShortcut.register('F12', devTools);

			globalShortcut.register('CmdOrCtrl+R', refresh);
			globalShortcut.register('F5', refresh);
		});

		app.on('browser-window-blur', function () {
			globalShortcut.unregister(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I');
			globalShortcut.unregister('F12');

			globalShortcut.unregister('CmdOrCtrl+R');
			globalShortcut.unregister('F5');
		});
	});
};
