'use strict';
const electron = require('electron');
const debug = require('.');

debug();

const load = async url => {
	const win = new electron.BrowserWindow({show: true});
	await win.loadURL(url);
	win.removeMenu();
};

(async () => {
	await electron.app.whenReady();
	await load(`file://${__dirname}/fixture.html`);
	await load('https://google.com');
})();
