import { app } from 'electron';
import { configure, Logger as Log4JsLogger } from 'log4js';
import * as path from 'path';
import { cwd } from 'process';
import { applyMiddleware } from 'redux';
import App from './app';
const fs = require('fs');
const appenders = ['apdFile'];
if (process.env.DEBUG) {
	appenders.push('apdConsoleAll');
} else {
	appenders.push('apdConsoleErr');
}

const layout = {
	type: 'pattern',
	pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m'
};

function createLogger(category: string) {
	const logPath = path.normalize(app.isPackaged ? path.join(app.getPath('userData'), 'logs') : path.join(cwd(), 'logs'))
	fs.mkdirSync(logPath, { recursive: true });
	return configure({
		appenders: {
			apdFile: { type: 'dateFile', filename: `${logPath}/whaleds_`, alwaysIncludePattern: true, pattern: 'yyyy-MM-dd.log', daysToKeep: 30, layout },
			apdConsoleAll: { type: 'console', layout },
			apdConsoleErr: {
				type: 'logLevelFilter',
				level: 'debug',
				category: category,
				appender: 'apdConsoleAll',
			},
		},
		categories: {
			default: { appenders: appenders, level: 'all' },
			[category]: { appenders: appenders, level: 'all' }
		}
	}).getLogger(category);
}

interface IRemoteLogger {
	trace(...args: any[]): void;
	log(...args: any[]): void;
	debug(...args: any[]): void;
	info(...args: any[]): void;
	warn(...args: any[]): void;
	error(...args: any[]): void;
}

const orgLogger: IRemoteLogger = {
	// tslint:disable-next-line: no-console
	log: console.log,
	trace: console.trace,
	debug: console.debug,
	info: console.info,
	warn: console.warn,
	error: console.error,
};

export class Logger {
	private allLoggers: Map<string, Log4JsLogger> = new Map();
	constructor() {
		this.allLoggers.set('', createLogger('app'));
	}
	public initialize() {
		// tslint:disable-next-line: no-console
		console.log = this.log.bind(this);
		console.trace = this.trace.bind(this);
		console.debug = this.debug.bind(this);
		console.info = this.info.bind(this);
		console.warn = this.warn.bind(this);
		console.error = this.error.bind(this);
	}
	private getLogger(category: any) {
		if (category && !this.allLoggers.has(category)) {
			this.allLoggers.set(category, createLogger(category));
		}
		return this.allLoggers.get(category);
	}

	private callLog(logType: string, ...args: any[]) {
		if (App.instance.isQuit) {
			return;
		}
		let logCate = '';
		if (args && args.length > 0 && args[0].webLog666) {
			logCate = args[0].logCategory;
			args.splice(0, 1);
		}
		const logger = this.getLogger(logCate);
		(logger as { [key: string]: any })[logType].apply(logger, args);
		(orgLogger as { [key: string]: any })[logType].apply(console, args);
	}

	private trace(...args: any[]) {
		this.callLog('trace', args);
	}

	private log(...args: any[]) {
		this.callLog('log', ...args);
	}
	private debug(...args: any[]) {
		this.callLog('debug', ...args);
	}

	private info(...args: any[]) {
		this.callLog('info', ...args);
	}

	private warn(...args: any[]) {
		this.callLog('warn', ...args);
	}

	private error(...args: any[]) {
		this.callLog('error', ...args);
	}
}

const logger = new Logger();
export default logger;
