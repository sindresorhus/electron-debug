'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');

require('.')();

app.on('ready', () => {
	(new BrowserWindow({show: true})).loadUrl('https://github.com');
	(new BrowserWindow({show: true})).loadUrl('https://google.com');
});
