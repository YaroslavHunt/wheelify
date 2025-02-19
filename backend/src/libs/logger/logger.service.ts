import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as winston from 'winston';
import * as path from 'path';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import { IS_DEV } from '@/libs/common/utils/is-dev.util';

winston.addColors({
	label: 'magenta',
	timestamp: 'magenta',
});

@Injectable()
export class WinstonLoggerService implements LoggerService {
	private static levels = ['info', 'warn', 'error', 'fatal'];
	private static localTimestamp = () => {
		const date = new Date();
		return date.toLocaleString();
	};

	private logger: winston.Logger;
	private context = 'App';

	constructor() {
		if (!IS_DEV) {
			this.createLogDirs();
		}
		this.initLogger();
	}

	private initLogger() {
		const transports: winston.transport[] = [
			new winston.transports.Console({
				format: winston.format.combine(
					winston.format.errors({ stack: true }),
					winston.format.colorize(),
					winston.format.timestamp({ format: WinstonLoggerService.localTimestamp }),
					winston.format.printf(({ timestamp, level, message, stack, context }) => {
						const ctx = context ? `[${context}]` : '[App]';
						const coloredCtx = winston.format.colorize().colorize('label', ctx);
						return `${timestamp} ${coloredCtx} ${level}: ${message}${stack ? `\nStack: ${stack}` : ''}`;
					})
				),
			}),
		];

		if (!IS_DEV) {
			WinstonLoggerService.levels.forEach(level => {
				transports.push(
					new winstonDailyRotateFile({
						level,
						filename: path.join('./logs', level, `${level}-%DATE%.log`),
						datePattern: 'YYYY-MM-DD',
						zippedArchive: true,
						maxFiles: '14d',
						format: winston.format.combine(
							winston.format.timestamp({ format: WinstonLoggerService.localTimestamp }),
							winston.format.printf(({ timestamp, level, message, stack, context }) => {
								return JSON.stringify({ timestamp, level, message, context, stack }, null, 2);
							})
						),
					})
				);
			});
		}

		this.logger = winston.createLogger({
			level: 'info',
			format: winston.format.combine(
				winston.format.errors({ stack: true }),
				winston.format.timestamp({ format: WinstonLoggerService.localTimestamp }),
				winston.format.splat(),
				winston.format.printf(({ timestamp, level, message, stack, context }) => {
					const ctx = context ? `[${context}]` : '[App]';
					const colored = winston.format.colorize().colorize(level, ctx);
					return `${timestamp} ${colored} ${level}: ${message}${stack ? `\nStack: ${stack}` : ''}`;
				})
			),
			transports,
		});
	}

	private createLogDirs() {
		WinstonLoggerService.levels.forEach(level => {
			const levelDir = path.join('./logs', level);
			if (!fs.existsSync(levelDir)) {
				fs.mkdirSync(levelDir, { recursive: true });
			}
		});
	}

	public setContext(context: string) {
		this.context = context;
	}

	private logMessage(level: string, message: any, optionalParams: any[]) {
		const context = this.context;
		const stack = (level === 'error' || level === 'warn' || level === 'fatal') ? new Error().stack : undefined;
		this.logger.log(level, message, { context, stack });
	}

	log(message: string, ...optionalParams: any[]) {
		this.logMessage('info', message, optionalParams);
	}

	error(message: string, ...optionalParams: any[]) {
		this.logMessage('error', message, optionalParams);
	}

	warn(message: string, ...optionalParams: any[]) {
		this.logMessage('warn', message, optionalParams);
	}

	debug(message: string, ...optionalParams: any[]) {
		this.logMessage('debug', message, optionalParams);
	}

	verbose(message: string, ...optionalParams: any[]) {
		this.logMessage('verbose', message, optionalParams);
	}

	fatal(message: string, ...optionalParams: any[]) {
		this.logMessage('fatal', message, optionalParams);
	}
}
