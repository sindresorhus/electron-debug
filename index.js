'use strict';
const electron = require('electron');
const localShortcut = require('electron-localshortcut');
const isDev = require('electron-is-dev');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
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

const isExtensionInstalled = name => {
	return BrowserWindow.getDevToolsExtensions &&
		{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), name);
};

const addDevtron = () => {
	try {
		if (!isExtensionInstalled('devtron')) {
			const devtron = require('devtron');

			if (devtron) {
				BrowserWindow.addDevToolsExtension(devtron.path);
			}
		}
	} catch (err) {
		console.error(`Can't verify if devtron is already installed: ${err}`);
	}
};

const addReactDevTools = () => {
	try {
		if (!isExtensionInstalled('electron-react-devtools')) {
			const electronReactDevTools = require('electron-react-devtools');

			if (electronReactDevTools) {
				BrowserWindow.addDevToolsExtension(electronReactDevTools.path);
			}
		}
	} catch (err) {
		console.error(`Can't verify if react-dev-tools is already installed: ${err}`);
	}
};

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
		addDevtron();
		addReactDevTools();

		localShortcut.register('CmdOrCtrl+Shift+C', inspectElements);
		localShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);
		localShortcut.register('F12', devTools);

		localShortcut.register('CmdOrCtrl+R', refresh);
		localShortcut.register('F5', refresh);
	});
};

module.exports.refresh = refresh;
module.exports.devTools = devTools;
module.exports.openDevTools = openDevTools;
