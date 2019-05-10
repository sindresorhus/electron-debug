/// <reference lib="dom"/>
/// <reference types="node"/>
import {expectType} from 'tsd';
import {BrowserWindow} from 'electron';
import electronDebug = require('.');
import {refresh, devTools, openDevTools} from '.';

expectType<void>(
	electronDebug({
		isEnabled: true,
		showDevTools: true
	})
);

expectType<void>(refresh(new BrowserWindow()));
expectType<void>(devTools());
expectType<void>(openDevTools());
