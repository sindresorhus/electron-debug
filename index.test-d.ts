import {expectType} from 'tsd-check';
import {BrowserWindow} from 'electron';
import electronDebug, {refresh, devTools, openDevTools} from '.';

expectType<void>(electronDebug({
	isEnabled: true,
	showDevTools: true
}));

expectType<void>(refresh(new BrowserWindow()));
expectType<void>(devTools());
expectType<void>(openDevTools());
