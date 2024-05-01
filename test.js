import {app, BrowserWindow} from 'electron';
import debug from './index.js';

debug();

const load = async url => {
	const window_ = new BrowserWindow({show: true});
	await window_.loadURL(url);
	window_.removeMenu();
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
	await app.whenReady();
	await load(`file://${import.meta.dirname}/fixture.html`);
	await load('https://google.com');
})();
