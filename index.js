'use strict';
const electron = require('electron');
const localShortcut = require('electron-localshortcut');
const isDev = require('electron-is-dev');

const {app, BrowserWindow} = electron;
const isMacOS = process.platform === 'darwin';

const devToolsOptions = {};

function getFocusedWebContents() {
	if (electron.webContents.getFocusedWebContents()) {
		return electron.webContents.getFocusedWebContents();
	}
	if (BrowserWindow.getFocusedWindow()) {
		return BrowserWindow.getFocusedWindow().webContents;
	}
	return null;
}

function toggleDevTools(focusedWebContents = getFocusedWebContents()) {
	if (focusedWebContents) {
		if (focusedWebContents.isDevToolsOpened()) {
			focusedWebContents.closeDevTools();
		} else {
			focusedWebContents.openDevTools(devToolsOptions);
		}
	}
}

function devTools(focusedWebContents = getFocusedWebContents()) {
	if (focusedWebContents) {
		toggleDevTools(focusedWebContents);
	}
}

function openDevTools(focusedWebContents = getFocusedWebContents()) {
	if (focusedWebContents) {
		focusedWebContents.openDevTools(devToolsOptions);
	}
}

function refresh(focusedWebContents = getFocusedWebContents()) {
	if (focusedWebContents) {
		focusedWebContents.reloadIgnoringCache();
	}
}

function inspectElements(focusedWebContents = getFocusedWebContents()) {
	const inspect = () => {
		focusedWebContents.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');
	};

	if (focusedWebContents) {
		if (focusedWebContents.isDevToolsOpened()) {
			inspect();
		} else {
			focusedWebContents.on('devtools-opened', inspect);
			focusedWebContents.openDevTools();
		}
	}
}

const addExtensionIfInstalled = (name, getPath) => {
	const isExtensionInstalled = name => {
		return BrowserWindow.getDevToolsExtensions &&
			{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), name);
	};

	try {
		if (!isExtensionInstalled(name)) {
			BrowserWindow.addDevToolsExtension(getPath(name));
		}
	} catch (_) {}
};

module.exports = opts => {
	opts = Object.assign({
		enabled: null,
		showDevTools: true,
		devToolsMode: 'undocked'
	}, opts);

	if (opts.enabled === false || (opts.enabled === null && !isDev)) {
		return;
	}

	if (opts.devToolsMode !== 'previous') {
		devToolsOptions.mode = opts.devToolsMode;
	}

	app.on('browser-window-created', (event, win) => {
		if (opts.showDevTools) {
			win.webContents.once('devtools-opened', () => {
				// Workaround for https://github.com/electron/electron/issues/13095
				setImmediate(() => {
					win.focus();
				});
			});

			/// Workaround for https://github.com/electron/electron/issues/12438
			win.webContents.once('dom-ready', () => {
				openDevTools(win.webContents, opts.showDevTools);
			});
		}
	});

	app.on('ready', () => {
		addExtensionIfInstalled('devtron', name => require(name).path);
		addExtensionIfInstalled('electron-react-devtools', name => require(name).path);

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
