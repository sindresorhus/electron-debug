import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import {app, BrowserWindow, contentTracing as electronContentTracing} from 'electron';
import localShortcut from 'electron-localshortcut';
import isDev from 'electron-is-dev';

const isMacOS = process.platform === 'darwin';
const contentTracingOptionsFile = 'contentTracingOptions.json';
const defaultContentTracingOptions = {
	// eslint-disable-next-line camelcase
	included_categories: ['*'],
};
let isContentTracing = false;

// A Map allows each window to have its own options
const developmentToolsOptions = new Map();

function toggleDevelopmentTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		const {webContents} = win;
		if (webContents.isDevToolsOpened()) {
			webContents.closeDevTools();
		} else {
			webContents.openDevTools(developmentToolsOptions.get(win));
		}
	}
}

function shouldRun(options) {
	return options && (options.isEnabled === true || (options.isEnabled === null && isDev));
}

function getOptionsForWindow(win, options) {
	if (!options.windowSelector) {
		return options;
	}

	const newOptions = options.windowSelector(win);

	return newOptions === true
		? options
		: (newOptions === false
			? {isEnabled: false}
			: {...options, ...newOptions});
}

async function registerAccelerators(win = BrowserWindow.getFocusedWindow(), options = {}) {
	await app.whenReady();

	if (win) {
		localShortcut.register(win, 'CommandOrControl+Shift+C', inspectElements);
		localShortcut.register(win, isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', devTools);
		localShortcut.register(win, 'F12', devTools);
		localShortcut.register(win, 'CommandOrControl+R', refresh);
		localShortcut.register(win, 'F5', refresh);
		if (options.contentTracing) {
			localShortcut.register(win, 'CommandOrControl+Shift+T', contentTracing);
		}
	} else {
		localShortcut.register('CommandOrControl+Shift+C', inspectElements);
		localShortcut.register(isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', devTools);
		localShortcut.register('F12', devTools);
		localShortcut.register('CommandOrControl+R', refresh);
		localShortcut.register('F5', refresh);
		if (options.contentTracing) {
			localShortcut.register('CommandOrControl+Shift+T', contentTracing);
		}
	}
}

function getContentTracingOptions() {
	const filePath = path.join(process.cwd(), contentTracingOptionsFile);

	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8'));
	} catch (error) {
		if (error.code !== 'ENOENT') {
			throw error;
		}

		fs.writeFileSync(filePath, `${JSON.stringify(defaultContentTracingOptions, undefined, '\t')}\n`);
		return defaultContentTracingOptions;
	}
}

async function toggleContentTracing() {
	if (isContentTracing) {
		const traceFilePath = path.join(process.cwd(), `content-tracing-${Date.now()}.json`);
		const resultFilePath = await electronContentTracing.stopRecording(traceFilePath);
		isContentTracing = false;
		process.stdout.write(`Content tracing stopped: ${resultFilePath}\n`);
		return;
	}

	await electronContentTracing.startRecording(getContentTracingOptions());
	isContentTracing = true;
	process.stdout.write('Content tracing started. Press CommandOrControl+Shift+T again to stop.\n');
}

async function contentTracing() {
	try {
		await toggleContentTracing();
	} catch (error) {
		process.stderr.write(`Content tracing failed: ${error.message}\n`);
	}
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export function devTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		toggleDevelopmentTools(win);
	}
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export function openDevTools(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		win.webContents.openDevTools(developmentToolsOptions.get(win));
	}
}

export function refresh(win = BrowserWindow.getFocusedWindow()) {
	if (win) {
		win.webContents.reloadIgnoringCache();
	}
}

function inspectElements() {
	const win = BrowserWindow.getFocusedWindow();
	const inspect = () => {
		win.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');
	};

	if (win) {
		if (win.webContents.isDevToolsOpened()) {
			inspect();
		} else {
			win.webContents.once('devtools-opened', inspect);
			win.openDevTools();
		}
	}
}

export default function debug(options) {
	options = {
		isEnabled: null,
		showDevTools: true,
		devToolsMode: 'previous',
		contentTracing: false,
		...options,
	};

	if (!options.windowSelector) {
		if (!shouldRun(options)) {
			return;
		}

		// When there's no filter, accelerators are defined globally
		registerAccelerators(undefined, options);
	}

	app.on('browser-window-created', (event, win) => {
		/// Workaround for https://github.com/electron/electron/issues/12438
		win.webContents.once('dom-ready', () => {
			const winOptions = getOptionsForWindow(win, options);

			if (winOptions.devToolsMode !== 'previous') {
				developmentToolsOptions.set(win, {
					...developmentToolsOptions.get(win),
					mode: winOptions.devToolsMode,
				});
			}

			if (!shouldRun(winOptions)) {
				return;
			}

			if (winOptions.windowSelector) {
				// With filters, accelerators are defined for each window depending on their provided options
				registerAccelerators(win, winOptions);
			}

			if (winOptions.showDevTools) {
				openDevTools(win);
			}
		});
	});
}
