import * as winston from 'winston';
import { info } from 'winston';
import { Injectable } from '@nestjs/common';
import { LogError } from './types/log.types';
import { createDailyRotateFileTransport, myFormat } from './utils/logger.utils';
import { localTimestamp, logDir } from './const/logger.const';

@Injectable()
export class WinstonLoggerService {
	private readonly logger: winston.Logger;

	constructor(label?: string) {
		this.logger = winston.createLogger({
			level: 'info',
			format: winston.format.combine(
				winston.format.splat(),
				winston.format.label({ label: label || 'App' }),
				winston.format.timestamp({ format: localTimestamp }),
				winston.format.errors({ stack: true }),
				myFormat,
			),
			transports: [
				createDailyRotateFileTransport('info', logDir),
				createDailyRotateFileTransport('warn', logDir),
				createDailyRotateFileTransport('error', logDir),
				process.env.MODE !== 'production' &&
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.timestamp({ format: localTimestamp }),
						myFormat
					),
					handleExceptions: true,
				}),
			].filter(Boolean),
		})
	}

	log(message: string, context?: string) {
		this.logger.info(message, { context });
	}

	error(message: string, e?: LogError) {
		if (!e) {
			this.logger.error(message);
			return;
		}
		this.logger.error({
			message: message || e.message,
			details: e.details || {},
			stack: e.stack,
		});
	}

	warn(message: string, e?: LogError) {
		if (!e) {
			this.logger.warn(message);
			return;
		} else {
			this.logger.warn({
				message: message || e.message,
				details: e.details || {},
				stack: e.stack,
			});
		}
	}

	debug(message: string, context?: string) {
		this.logger.debug(message, { context });
	}

	verbose(message: string, context?: string) {
		this.logger.verbose(message, { context });
	}
}
