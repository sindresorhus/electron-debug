'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');

require('.')({showDevTools: true});

app.on('ready', () => {
	(new BrowserWindow({show: true})).loadURL('https://github.com');
	(new BrowserWindow({show: true})).loadURL('https://google.com');
});
