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

function activateDebugContextMenu(e) {
	const webContents = e.sender;
	webContents.executeJavaScript(`require('${__dirname}/debug-context-menu').install();`);
}

function deactivateDebugContextMenu(e) {
	const webContents = e.sender;
	webContents.executeJavaScript(`require('${__dirname}/debug-context-menu').uninstall();`);
}

function installDebugContextMenu(win) {
	win.webContents.on('devtools-opened', activateDebugContextMenu);
	win.webContents.on('devtools-closed', deactivateDebugContextMenu);
	if (win.webContents.isDevToolsOpened()) {
		activateDebugContextMenu({sender: win.webContents});
	}
}

function uninstallDebugContextMenu(win) {
	win.webContents.removeListener('devtools-opened', activateDebugContextMenu);
	win.webContents.removeListener('devtools-closed', deactivateDebugContextMenu);
}

module.exports = function () {
	app.on('ready', function () {
		app.on('browser-window-focus', function (e, win) {
			globalShortcut.register(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
			globalShortcut.register('F12', devTools);

			globalShortcut.register('CmdOrCtrl+R', refresh);
			globalShortcut.register('F5', refresh);

			installDebugContextMenu(win);
		});

		app.on('browser-window-blur', function (e, win) {
			globalShortcut.unregister(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I');
			globalShortcut.unregister('F12');

			globalShortcut.unregister('CmdOrCtrl+R');
			globalShortcut.unregister('F5');

			uninstallDebugContextMenu(win);
		});
	});
};
