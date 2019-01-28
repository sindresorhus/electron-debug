'use strict';
const electron = require('electron');
const debug = require('.');

debug();

function load(url) {
	const win = new electron.BrowserWindow({show: true});
	win.loadURL(url);
	win.setMenu(null);
}

electron.app.on('ready', () => {
	load(`file://${__dirname}/fixture.html`);
	load('https://google.com');
});
