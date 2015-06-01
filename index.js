'use strict';
var globalShortcut = require('global-shortcut');

module.exports = function (win) {
	win.on('focus', function () {
		globalShortcut.register('Alt+CmdOrCtrl+I', function () {
			win.toggleDevTools();
		});
	});

	win.on('blur', function () {
		globalShortcut.unregister('Alt+CmdOrCtrl+I');
	});
};
