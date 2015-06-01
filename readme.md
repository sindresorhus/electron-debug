# electron-debug

> Adds useful debug features to your [Electron](http://electron.atom.io) app

Currently it only adds a keyboard shortcut to toggle Dev Tools, but more is planned and ideas welcome!


## Install

```
$ npm install --save electron-debug
```


## Usage

```js
const debug = require('electron-debug');

let win;

app.on('ready', function () {
	win = new BrowserWindow();
	debug(win);
});
```

And then press `Alt+Cmd+I` on OS X or `Alt+Ctrl+I` on Linux and Windows to toggle Dev Tools.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
