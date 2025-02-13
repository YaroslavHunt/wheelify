import { Global, Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as winston from 'winston'

import { localTimestamp, logDir } from './const/logger.const'
import { LogError } from './types/log.types'
import { createDailyRotateFileTransport, myFormat } from './utils/logger.utils'

@Global() //TODO check ??
@Injectable()
export class WinstonLoggerService {
	private logger: winston.Logger
	private label = 'App'

	constructor() {
		this.createLogDir()
		this.initLogger()
	}

	setLabel(label: string) {
		this.label = label
		this.initLogger()
	}

	private initLogger() {
		this.logger = winston.createLogger({
			level: 'info',
			format: winston.format.combine(
				winston.format.splat(),
				winston.format.label({ label: this.label }),
				winston.format.timestamp({ format: localTimestamp }),
				winston.format.errors({ stack: true }),
				myFormat
			),
			transports: [
				createDailyRotateFileTransport('info', logDir),
				createDailyRotateFileTransport('warn', logDir),
				createDailyRotateFileTransport('error', logDir),
				process.env.MODE !== 'production' &&
					new winston.transports.Console({
						format: winston.format.combine(
							winston.format.colorize(),
							winston.format.timestamp({
								format: localTimestamp
							}),
							myFormat
						),
						handleExceptions: true
					})
			].filter(Boolean)
		})
	}

	private createLogDir() {
		try {
			if (!fs.existsSync(logDir)) {
				fs.mkdirSync(logDir, { recursive: true })
			}
		} catch (e) {
			console.error('Error creating log directory:', e)
		}
	}

	log(message: string) {
		this.logger.info(message, { label: this.label })
	}

	error(message: string, e?: LogError) {
		const logDetails: LogError = e || { message }
		this.logger.error(message, { label: this.label, ...logDetails })
	}

	warn(message: string, e?: LogError) {
		const logDetails: LogError = e || { message }
		this.logger.warn(message, { label: this.label, ...logDetails })
	}

	debug(message: string) {
		this.logger.debug(message, { label: this.label })
	}
}
