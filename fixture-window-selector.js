// Runs inside Electron and reports which windows a `windowSelector` applies the options to, including the windows that already exist when `debug()` is called.
import fs from 'node:fs';
import {app, BrowserWindow} from 'electron';
import debug from './index.js';

const delay = milliseconds => new Promise(resolve => {
	setTimeout(resolve, milliseconds);
});

// Records the arguments each window's `openDevTools` is called with.
const watch = win => {
	const opened = [];
	const originalOpenDevTools = win.webContents.openDevTools.bind(win.webContents);

	win.webContents.openDevTools = (...parameters) => {
		opened.push(parameters);
		return originalOpenDevTools(...parameters);
	};

	return opened;
};

const main = async () => {
	const wanted = new BrowserWindow({show: true});
	await wanted.loadURL('data:text/html,<h1>Wanted</h1>');
	const wantedOpened = watch(wanted);

	const ignored = new BrowserWindow({show: true});
	await ignored.loadURL('data:text/html,<h1>Ignored</h1>');
	const ignoredOpened = watch(ignored);

	// Filter by window reference, which only works for windows that already exist.
	const selected = new Set([wanted]);
	debug({isEnabled: true, devToolsMode: 'detach', windowSelector: win => selected.has(win)});

	const later = new BrowserWindow({show: true});
	const laterOpened = watch(later);
	selected.add(later);
	await later.loadURL('data:text/html,<h1>Later</h1>');

	await delay(1500);

	fs.writeSync(1, `RESULT ${JSON.stringify({wantedOpened, ignoredOpened, laterOpened})}\n`);
	app.exit(0);
};

app.whenReady().then(main);
