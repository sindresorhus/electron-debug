'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

require('.')({showDevTools: true});

function load(url) {
	const win = new BrowserWindow({show: true});
	win.loadURL(url);
	win.setMenu(null);
}

app.on('ready', () => {
	load('https://github.com');
	load('https://google.com');
});
