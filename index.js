import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
	app,
	BrowserWindow,
	contentTracing as electronContentTracing,
	shell,
} from 'electron';
import localShortcut from 'electron-localshortcut';
import isDev from 'electron-is-dev';

const isMacOS = process.platform === 'darwin';
const contentTracingOptionsFile = 'contentTracingOptions.json';

const defaultContentTracingOptions = {
	categoryFilter: '*',
	traceOptions: 'record-until-full',
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

function normalizeContentTracingOptions(options) {
	if (!options) {
		return false;
	}

	return {
		shortcut: 'CommandOrControl+Shift+T',
		optionsFile: contentTracingOptionsFile,
		openTraceFile: true,
		...(options === true ? {} : options),
	};
}

function normalizeOptions(options) {
	return {
		...options,
		contentTracing: normalizeContentTracingOptions(options.contentTracing),
	};
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
			: normalizeOptions({...options, ...newOptions}));
}

function resolveLaunchPath(filePath) {
	return path.isAbsolute(filePath)
		? filePath
		: path.join(process.cwd(), filePath);
}

async function readContentTracingOptions(optionsFile) {
	const optionsFilePath = resolveLaunchPath(optionsFile);

	try {
		return JSON.parse(await fs.readFile(optionsFilePath, 'utf8'));
	} catch (error) {
		if (error.code !== 'ENOENT') {
			throw error;
		}

		await fs.writeFile(optionsFilePath, `${JSON.stringify(defaultContentTracingOptions, undefined, '\t')}\n`);
		return defaultContentTracingOptions;
	}
}

function getContentTracingOutputFile(outputFile) {
	if (outputFile) {
		return resolveLaunchPath(outputFile);
	}

	const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
	return path.join(process.cwd(), `content-tracing-${timestamp}.json`);
}

async function toggleContentTracing(options) {
	if (isContentTracing) {
		const traceFilePath = await electronContentTracing.stopRecording(getContentTracingOutputFile(options.outputFile));
		isContentTracing = false;

		if (options.openTraceFile) {
			await shell.openPath(traceFilePath);
		}

		return;
	}

	const tracingOptions = await readContentTracingOptions(options.optionsFile);
	await electronContentTracing.startRecording(tracingOptions);
	isContentTracing = true;
}

function toggleContentTracingFromShortcut(options) {
	toggleContentTracing(options).catch(error => {
		console.error(error);
	});
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
			localShortcut.register(win, options.contentTracing.shortcut, () => {
				toggleContentTracingFromShortcut(options.contentTracing);
			});
		}
	} else {
		localShortcut.register('CommandOrControl+Shift+C', inspectElements);
		localShortcut.register(isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', devTools);
		localShortcut.register('F12', devTools);
		localShortcut.register('CommandOrControl+R', refresh);
		localShortcut.register('F5', refresh);

		if (options.contentTracing) {
			localShortcut.register(options.contentTracing.shortcut, () => {
				toggleContentTracingFromShortcut(options.contentTracing);
			});
		}
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
		...options,
	};
	options = normalizeOptions(options);

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
