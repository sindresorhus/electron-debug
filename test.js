'use strict';
const electron = require('electron');
const debug = require('.');

debug();

const load = async url => {
	const window_ = new electron.BrowserWindow({show: true});
	await window_.loadURL(url);
	window_.removeMenu();
};

(async () => {
	await electron.app.whenReady();
	await load(`file://${__dirname}/fixture.html`);
	await load('https://google.com');
})();
