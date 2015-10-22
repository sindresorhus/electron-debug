'use strict';
const remote = require('remote');
const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');
const BrowserWindow = remote.require('browser-window');

let rightClickPosition = null;

const menu = buildDebugMenu();

module.exports = {
	install: install,
	uninstall: uninstall
};

function buildDebugMenu() {
	const mnu = new Menu();
	mnu.append(new MenuItem({
		label: 'Inspect element',
		click: () => {
			const currentWindow = BrowserWindow.getFocusedWindow();
			currentWindow.inspectElement(rightClickPosition.x, rightClickPosition.y);
		}
	}));
	return mnu;
}

function install() {
	global.window.addEventListener('contextmenu', onContextMenu, false);
}

function uninstall() {
	global.window.removeEventListener('contextmenu', onContextMenu, false);
}

function onContextMenu(e) {
	e.preventDefault();
	rightClickPosition = {x: e.x, y: e.y};
	menu.popup();
}
