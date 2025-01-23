import * as fs from 'node:fs';
import * as path from 'path';
import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import { Injectable } from '@nestjs/common';

const logDirectory = path.join(__dirname, '../logs');

if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory, { recursive: true });
}

const localTimestamp = () => {
	const date = new Date();
	return date.toLocaleString();
};

const myFormat = winston.format.printf((info) => {
	if (info instanceof Error) {
		return `[${info.timestamp}] [${info.label}] ${info.level}: ${info.message} ${info.stack}`;
	}
	return `[${info.timestamp}] [${info.label}] ${info.level}: ${info.message}`;
});

@Injectable()
export class WinstonLoggerService {
	private readonly logger: winston.Logger;

	constructor(label: string = 'App') {
		this.logger = winston.createLogger({
			level: 'info',
			format: winston.format.combine(
				winston.format.splat(),
				winston.format.label({ label }),
				winston.format.timestamp({ format: localTimestamp }),
				winston.format.errors({ stack: true }),
				myFormat,
			),
			transports: [
				process.env.MODE === 'production'
					? new winstonDailyRotateFile({
						filename: path.join(logDirectory, 'error-%DATE%.log'),
						datePattern: 'YYYY-MM-DD-HH',
						zippedArchive: true,
						format: winston.format.json(),
						handleExceptions: true,
					})
					: new winston.transports.Console({
						format: winston.format.combine(
							winston.format.colorize(),
							winston.format.timestamp({ format: localTimestamp }),
							myFormat,
						),
						handleExceptions: true,
					}),
			],
		});
	}

	log(message: string, context?: string) {
		this.logger.info(message, { context });
	}

	error(message: string, trace?: string, context?: string) {
		this.logger.error(message, { stack: trace, context });
	}

	warn(message: string, context?: string) {
		this.logger.warn(message, { context });
	}

	debug(message: string, context?: string) {
		this.logger.debug(message, { context });
	}

	verbose(message: string, context?: string) {
		this.logger.verbose(message, { context });
	}
}
