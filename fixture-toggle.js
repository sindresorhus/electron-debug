// Runs inside Electron and reports the DevTools events the F12 shortcut causes.
import fs from 'node:fs';
import {app, BrowserWindow} from 'electron';
import debug from './index.js';

debug({isEnabled: true, showDevTools: false});

const delay = milliseconds => new Promise(resolve => {
	setTimeout(resolve, milliseconds);
});

const main = async () => {
	const win = new BrowserWindow({show: true});
	const events = [];

	win.webContents.on('devtools-opened', () => {
		events.push('opened');
	});

	win.webContents.on('devtools-closed', () => {
		events.push('closed');
	});

	await win.loadURL('data:text/html,<h1>Fixture</h1>');
	app.focus({steal: true});
	win.focus();
	await delay(500);

	const waitFor = name => new Promise(resolve => {
		win.webContents.once(name, resolve);
	});

	const opened = waitFor('devtools-opened');
	win.webContents.sendInputEvent({type: 'keyDown', keyCode: 'F12'});
	await opened;

	const closed = waitFor('devtools-closed');
	win.webContents.sendInputEvent({type: 'keyDown', keyCode: 'F12'});
	await closed;

	fs.writeSync(1, `RESULT ${JSON.stringify({events})}\n`);
	app.exit(0);
};

app.whenReady().then(main);
