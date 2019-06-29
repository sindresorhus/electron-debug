'use strict';
const {app, BrowserWindow} = require('electron');
const localShortcut = require('electron-localshortcut');
const isDev = require('electron-is-dev');

const isMacOS = process.platform === 'darwin';

const devToolsOptions = {};

function toggleDevTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		const {webContents} = win;
		if (webContents.isDevToolsOpened()) {
			webContents.closeDevTools();
		} else {
			webContents.openDevTools(devToolsOptions);
		}
	}
}

function devTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		toggleDevTools(win);
	}
}

function openDevTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		win.webContents.openDevTools(devToolsOptions);
	}
}

function refresh(win = BrowserWindow.getFocusedWindow()) {
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
			win.webContents.once('devtools-opened', inspect);
			win.openDevTools();
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

module.exports = options => {
	options = {
		isEnabled: null,
		showDevTools: true,
		devToolsMode: 'previous',
		...options
	};

	if (options.isEnabled === false || (options.isEnabled === null && !isDev)) {
		return;
	}

	if (options.devToolsMode !== 'previous') {
		devToolsOptions.mode = options.devToolsMode;
	}

	app.on('browser-window-created', (event, win) => {
		if (options.showDevTools) {
			/// Workaround for https://github.com/electron/electron/issues/12438
			win.webContents.once('dom-ready', () => {
				openDevTools(win, options.showDevTools, false);
			});
		}
	});

	(async () => {
		await app.whenReady();

		addExtensionIfInstalled('devtron', name => require(name).path);
		addExtensionIfInstalled('electron-react-devtools', name => require(name).path);

		localShortcut.register('CommandOrControl+Shift+C', inspectElements);
		localShortcut.register(isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', devTools);
		localShortcut.register('F12', devTools);

		localShortcut.register('CommandOrControl+R', refresh);
		localShortcut.register('F5', refresh);
	})();
};

module.exports.refresh = refresh;
module.exports.devTools = devTools;
module.exports.openDevTools = openDevTools;
