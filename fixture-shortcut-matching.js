// Runs inside Electron and reports which key presses the package acts on.
import fs from 'node:fs';
import {app, BrowserWindow} from 'electron';
import debug from './index.js';

debug({isEnabled: true, showDevTools: false});

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

	const reloads = [];
	const originalReload = win.webContents.reloadIgnoringCache.bind(win.webContents);

	win.webContents.reloadIgnoringCache = () => {
		reloads.push(1);
		return originalReload();
	};

	// Registered after the package's own listener, so this sees whether the package swallowed the key.
	const keyPresses = [];
	win.webContents.on('before-input-event', (event, input) => {
		if (input.type === 'keyDown') {
			keyPresses.push({key: input.key, prevented: event.defaultPrevented});
		}
	});

	await win.loadURL('data:text/html,<h1>Fixture</h1>');
	app.focus({steal: true});
	win.focus();
	await delay(500);

	const result = {};

	// `Cmd+Shift+R` is not one of the package's shortcuts, so nothing may happen.
	win.webContents.sendInputEvent({type: 'keyDown', keyCode: 'R', modifiers: ['cmd', 'shift']});
	await settle(() => keyPresses.length > 0);
	result.afterUnrelatedKey = {reloads: reloads.length, keyPresses: keyPresses.splice(0)};

	// `Cmd+R` is, so it reloads without the cache.
	win.webContents.sendInputEvent({type: 'keyDown', keyCode: 'R', modifiers: ['cmd']});
	await settle(() => reloads.length > 0);
	result.afterReloadKey = {reloads: reloads.length, keyPresses: keyPresses.splice(0)};

	fs.writeSync(1, `RESULT ${JSON.stringify(result)}\n`);
	app.exit(0);
};

app.whenReady().then(main);
