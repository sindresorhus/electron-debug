# electron-debug

> Adds useful debug features to your [Electron](http://electron.atom.io) app

Ideas for more features welcome!


## Features

### Dev Tools

Press `Alt+Cmd+I` on OS X or `Alt+Ctrl+I` on Linux and Windows to toggle Dev Tools.


## Install

```
$ npm install --save electron-debug
```


## Usage

```js
require('electron-debug')();

let win;

app.on('ready', function () {
	win = new BrowserWindow({});
});
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
