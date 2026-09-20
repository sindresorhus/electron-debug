import {app, BrowserWindow} from 'electron';
import debug from './index.js';

debug();

const load = async url => {
	const window_ = new BrowserWindow({show: true});
	await window_.loadURL(url);
	window_.removeMenu();
};

// Top-level `await` cannot be used here. Electron does not make the app ready until the main module has finished evaluating, so awaiting `app.whenReady()` at the top level deadlocks. `unicorn/prefer-top-level-await` is off in the XO config for this reason.
(async () => {
	await app.whenReady();
	await load(new URL('fixture.html', import.meta.url).href);
	await load('https://google.com');
})();
