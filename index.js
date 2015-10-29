'use strict';
const app = require('app');
const globalShortcut = require('global-shortcut');
const BrowserWindow = require('browser-window');
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
		win.reloadIgnoringCache();
	}
}

function activateDebugContextMenu(e) {
	const webContents = e.sender;
	webContents.executeJavaScript(`require('${__dirname}/context-menu').install();`);
}

function deactivateDebugContextMenu(e) {
	const webContents = e.sender;
	webContents.executeJavaScript(`require('${__dirname}/context-menu').uninstall();`);
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

module.exports = opts => {
	opts = opts || {};

	app.on('ready', () => {
		if (opts.showDevTools) {
			app.once('browser-window-created', (e, win) => {
				devTools(win);
			});
		}

		app.on('browser-window-focus', (e, win) => {
			globalShortcut.register(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
			globalShortcut.register('F12', devTools);

			globalShortcut.register('CmdOrCtrl+R', refresh);
			globalShortcut.register('F5', refresh);

			installDebugContextMenu(win);
		});

		app.on('browser-window-blur', (e, win) => {
			globalShortcut.unregister(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I');
			globalShortcut.unregister('F12');

			globalShortcut.unregister('CmdOrCtrl+R');
			globalShortcut.unregister('F5');

			uninstallDebugContextMenu(win);
		});
	});
};
