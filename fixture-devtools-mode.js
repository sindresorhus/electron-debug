// Runs inside Electron and reports what the shortcuts hand to `openDevTools`.
import fs from 'node:fs';
import {app, BrowserWindow} from 'electron';
import debug from './index.js';

const result = {
	onCreation: [],
	fromInspectorShortcut: [],
	fromDevToolsShortcut: [],
	keyPresses: [],
};

debug({isEnabled: true, showDevTools: false, devToolsMode: 'detach'});

const delay = milliseconds => new Promise(resolve => {
	setTimeout(resolve, milliseconds);
});

// Waits for the effect a key press should cause, so a slow machine cannot fail an assertion that is about to pass.
const settle = async (predicate, attempts = 30) => {
	if (attempts === 0 || predicate()) {
		return;
	}

	await delay(100);

	return settle(predicate, attempts - 1);
};

const main = async () => {
	const win = new BrowserWindow({show: true});

	// `openDevTools` is the only place the mode shows up, so record the arguments it is called with.
	const opened = [];
	const originalOpenDevTools = win.webContents.openDevTools.bind(win.webContents);

	win.webContents.openDevTools = (...parameters) => {
		opened.push(parameters);
		return originalOpenDevTools(...parameters);
	};

	// Registered after the package's own listener, so this sees whether the package swallowed the key.
	win.webContents.on('before-input-event', (event, input) => {
		if (input.type === 'keyDown') {
			result.keyPresses.push({key: input.key, prevented: event.defaultPrevented});
		}
	});

	await win.loadURL('data:text/html,<h1>Fixture</h1>');
	app.focus({steal: true});
	win.focus();

	await delay(1000);
	result.onCreation = opened.splice(0);

	const waitFor = name => new Promise(resolve => {
		win.webContents.once(name, resolve);
	});

	win.webContents.sendInputEvent({type: 'keyDown', keyCode: 'C', modifiers: ['cmd', 'shift']});
	await settle(() => opened.length > 0);
	result.fromInspectorShortcut = opened.splice(0);

	// The Inspector shortcut left DevTools open, and the DevTools shortcut toggles, so close them to observe it opening.
	const closed = waitFor('devtools-closed');
	win.webContents.closeDevTools();
	await closed;

	win.webContents.sendInputEvent({type: 'keyDown', keyCode: 'I', modifiers: ['cmd', 'alt']});
	await settle(() => opened.length > 0);
	result.fromDevToolsShortcut = opened.splice(0);

	fs.writeSync(1, `RESULT ${JSON.stringify(result)}\n`);
	app.exit(0);
};

app.whenReady().then(main);
