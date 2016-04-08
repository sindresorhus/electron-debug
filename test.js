'use strict';
const electron = require('electron');

require('.')({showDevTools: true});

function load(url) {
	const win = new electron.BrowserWindow({show: true});
	win.loadURL(url);
	win.setMenu(null);
}

electron.app.on('ready', () => {
	load('https://github.com');
	load('https://google.com');
});
