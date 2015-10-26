'use strict';
const remote = require('remote');
const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');
const BrowserWindow = remote.require('browser-window');

let rightClickPos = null;

const menu = (() => {
	const m = new Menu();

	m.append(new MenuItem({
		label: 'Inspect element',
		click: () => {
			BrowserWindow
				.getFocusedWindow()
				.inspectElement(rightClickPos.x, rightClickPos.y);
		}
	}));

	return m;
})();

function onContextMenu(e) {
	e.preventDefault();
	rightClickPos = {x: e.x, y: e.y};
	menu.popup();
}

exports.install = () => {
	window.addEventListener('contextmenu', onContextMenu);
};

exports.uninstall = () => {
	window.removeEventListener('contextmenu', onContextMenu);
};
