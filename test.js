import path from 'node:path';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {test} from 'node:test';
import electron from 'electron';

const execFileAsync = promisify(execFile);

/*
Run one `fixture-*.js` inside Electron and return the result it reports.

Each fixture gets a fresh Electron process, so the module state in `index.js` cannot leak between fixtures.
*/
const runFixture = async name => {
	const fixture = path.join(import.meta.dirname, `fixture-${name}.js`);
	const {stdout} = await execFileAsync(electron, [fixture], {timeout: 30_000});
	const reported = stdout.split('\n').find(line => line.startsWith('RESULT '));

	if (!reported) {
		throw new Error(`fixture-${name}.js reported no result. Output:\n${stdout}`);
	}

	return JSON.parse(reported.slice('RESULT '.length));
};

const devToolsMode = await runFixture('devtools-mode');

test('`showDevTools: false` does not open DevTools on window creation', () => {
	assert.deepEqual(devToolsMode.onCreation, []);
});

test('the Element Inspector shortcut opens DevTools with `devToolsMode`', () => {
	assert.deepEqual(devToolsMode.fromInspectorShortcut, [[{mode: 'detach'}]]);
});

test('the DevTools shortcut opens DevTools with `devToolsMode`', () => {
	assert.deepEqual(devToolsMode.fromDevToolsShortcut, [[{mode: 'detach'}]]);
});

test('the shortcuts swallow the key so the app menu cannot handle it again', () => {
	assert.deepEqual(devToolsMode.keyPresses.map(({prevented}) => prevented), [true, true]);
});

const toggle = await runFixture('toggle');

test('F12 opens DevTools when they are closed and closes them when they are open', () => {
	assert.deepEqual(toggle.events, ['opened', 'closed']);
});

const shortcutMatching = await runFixture('shortcut-matching');

test('a key press that is not a shortcut runs nothing and is not swallowed', () => {
	assert.equal(shortcutMatching.afterUnrelatedKey.reloads, 0);
	assert.deepEqual(shortcutMatching.afterUnrelatedKey.keyPresses.map(({prevented}) => prevented), [false]);
});

test('the reload shortcut reloads and is swallowed', () => {
	assert.equal(shortcutMatching.afterReloadKey.reloads, 1);
	assert.deepEqual(shortcutMatching.afterReloadKey.keyPresses.map(({prevented}) => prevented), [true]);
});

const windowSelector = await runFixture('window-selector');

test('a window that already exists when `debug()` is called gets the options', () => {
	assert.deepEqual(windowSelector.wantedOpened, [[{mode: 'detach'}]]);
});

test('a window created after `debug()` is called gets the options', () => {
	assert.deepEqual(windowSelector.laterOpened, [[{mode: 'detach'}]]);
});

test('a window that the `windowSelector` rejects is left alone', () => {
	assert.deepEqual(windowSelector.ignoredOpened, []);
});
