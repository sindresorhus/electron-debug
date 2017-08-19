'use strict';
const electron = require('electron');
const localShortcut = require('electron-localshortcut');
const isDev = require('electron-is-dev');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isMacOS = process.platform === 'darwin';

function devTools(win) {
	win = win || BrowserWindow.getFocusedWindow();
	var toggleStatus = win ? win.webContents.isDevToolsOpened() : undefined;

	openDevTools(win, toggleStatus);
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

function installDevtron() {
	// Activate devtron for the user if they have it installed and it's not already added
	try {
		const devtronAlreadyAdded = BrowserWindow.getDevToolsExtensions &&
			{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), 'devtron');

		if (!devtronAlreadyAdded) {
			BrowserWindow.addDevToolsExtension(require('devtron').path);
		}
	} catch (err) {
	}

	//Add standard shortcuts for Chrome interactions
	localShortcut.register('CmdOrCtrl+Shift+C', inspectElements);
	localShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
	localShortcut.register('F12', devTools);

	localShortcut.register('CmdOrCtrl+R', refresh);
	localShortcut.register('F5', refresh);
}

module.exports = opts => {
	opts = Object.assign({
		enabled: null,
		initWindow: undefined,
		showDevTools: false
	}, opts);

	if (opts.enabled === false || (opts.enabled === null && !isDev)) {
		return;
	}

	//If the app is already "ready," then install immediately, otherwise wait for the app.
	if (app.isReady()) {
		installDevtron();
	} else {
		app.on('ready', installDevtron);
	}

	//If we want to showDevTools, toggle immediately if initWindow is defined...
	if (opts.showDevTools) {
		if (opts.initWindow) {
			openDevTools(opts.initWindow, opts.showDevTools);
		} else {
			//... otherwise wait for a window to be created.
			app.on('browser-window-created', (e, win) => {
				openDevTools(win, opts.showDevTools);
			});
		}
	}
};

module.exports.refresh = refresh;
module.exports.devTools = devTools;
module.exports.openDevTools = openDevTools;
