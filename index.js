'use strict';
const app = require('app');
const globalShortcut = require('global-shortcut');
const BrowserWindow = require('browser-window');

module.exports = function () {
	app.on('ready', function () {
		globalShortcut.register('Alt+CmdOrCtrl+I', function () {
			var win = BrowserWindow.getFocusedWindow();

			if (win) {
				win.toggleDevTools();
			}
		});
	});
};
