'use strict';
const app = require('app');
const globalShortcut = require('global-shortcut');
const BrowserWindow = require('browser-window');
const isOSX = process.platform === 'darwin';

module.exports = function () {
	app.on('ready', function () {
		globalShortcut.register(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
		globalShortcut.register('F12', devTools);

		globalShortcut.register('CmdOrCtrl+R', refresh);
		globalShortcut.register('F5', refresh);

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
	});
};
