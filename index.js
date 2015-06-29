'use strict';
const app = require('app');
const globalShortcut = require('global-shortcut');
const BrowserWindow = require('browser-window');
const isOSX = process.platform === 'darwin';

module.exports = function () {
	app.on('ready', function () {
		globalShortcut.register(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', function () {
			var win = BrowserWindow.getFocusedWindow();

			if (win) {
				win.toggleDevTools();
			}
		});

		globalShortcut.register('CmdOrCtrl+R', function () {
			var win = BrowserWindow.getFocusedWindow();

			if (win) {
				win.reloadIgnoringCache();
			}
		});
	});
};
