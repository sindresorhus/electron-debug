'use strict';
const electron = require('electron');
const fs = require('fs');
const localShortcut = require('electron-localshortcut');
const isDev = require('electron-is-dev');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const clipboard = electron.clipboard;
const isMacOS = process.platform === 'darwin';

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

function inspectElements() {
	const win = BrowserWindow.getFocusedWindow();
	const inspect = () => {
		win.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');
	};

	if (win) {
		if (win.webContents.isDevToolsOpened()) {
			inspect();
		} else {
			win.webContents.on('devtools-opened', inspect);
			win.openDevTools();
		}
	}
}

function screenshot(win) {
	win = win || BrowserWindow.getFocusedWindow();
	win.capturePage(image => {
		dialog.showMessageBox(win, {type: 'question', buttons: ['Cancel', 'Copy to clipboard', 'Save to file'], message: 'What would you like to do with this image?', cancelId: 0}, response => {
			if (response === 1) {
				clipboard.writeImage(image);
			} else if (response === 2) {
				dialog.showSaveDialog(win, {filters: [{name: 'Images', extensions: ['jpg', 'png']}]}, filename => {
					if (filename) {
						const filetype = filename.split('.').pop();
						let imageBuffer;

						if (filetype === 'png') {
							imageBuffer = image.toPNG();
						} else if (filetype === 'jpg') {
							imageBuffer = image.toJPEG(100);
						}

						if (imageBuffer) {
							fs.writeFile(filename, imageBuffer, err => {
								if (err) {
									throw err;
								}
							});
						}
					}
				});
			}
		});
	});
}

module.exports = opts => {
	opts = Object.assign({
		enabled: null,
		showDevTools: false
	}, opts);

	if (opts.enabled === false || (opts.enabled === null && !isDev)) {
		return;
	}

	app.on('browser-window-created', (e, win) => {
		if (opts.showDevTools) {
			openDevTools(win, opts.showDevTools);
		}
	});

	app.on('ready', () => {
		// activate devtron for the user if they have it installed and it's not already added
		try {
			const devtronAlreadyAdded = BrowserWindow.getDevToolsExtensions &&
				{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), 'devtron');

			if (!devtronAlreadyAdded) {
				BrowserWindow.addDevToolsExtension(require('devtron').path);
			}
		} catch (err) {}

		localShortcut.register('CmdOrCtrl+Shift+C', inspectElements);
		localShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
		localShortcut.register('F12', devTools);

		localShortcut.register('CmdOrCtrl+R', refresh);
		localShortcut.register('F5', refresh);

		localShortcut.register(isMacOS ? 'Cmd+Alt+3' : 'Ctrl+PrintScreen', screenshot);
	});
};

module.exports.refresh = refresh;
module.exports.devTools = devTools;
module.exports.openDevTools = openDevTools;
