'use strict';
const app = require('app');
const localShortcut = require('electron-localshortcut');
const BrowserWindow = require('browser-window');
const isOSX = process.platform === 'darwin';

function devTools() {
	const win = BrowserWindow.getFocusedWindow();

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
	webContents.executeJavaScript(`window.__electron_debug.require('${__dirname}/context-menu').install();`);
}

function deactivateDebugContextMenu(e) {
	const webContents = e.sender;
	webContents.executeJavaScript(`window.__electron_debug.require('${__dirname}/context-menu').uninstall();`);
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

module.exports = () => {
	app.on('browser-window-created', (e, win) => {
		win.webContents.executeJavaScript('window.__electron_debug = {require: window.require};');
	});

	app.on('ready', () => {
		localShortcut.register(isOSX ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
		localShortcut.register('F12', devTools);

		localShortcut.register('CmdOrCtrl+R', refresh);
		localShortcut.register('F5', refresh);
	});

	app.on('browser-window-focus', (e, win) => {
		installDebugContextMenu(win);
	});

	app.on('browser-window-blur', (e, win) => {
		uninstallDebugContextMenu(win);
	});
};
