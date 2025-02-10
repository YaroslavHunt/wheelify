import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

winston.addColors({
	label: 'magenta',
	timestamp: 'magenta',
});

export const myFormat = winston.format.printf((info) => {
	const timestamp = winston.format.colorize().colorize('timestamp', `[${info.timestamp}]`);
	const label = winston.format.colorize().colorize('label', `[${info.label}]`);

	if (info instanceof Error || info.stack) {
		const details = info.details
			? JSON.stringify(info.details, null, 2)
			: 'No additional details';
		return `${timestamp} ${label} ${info.level}: ${info.message}\nDetails: ${details}\nStack: ${info.stack}`;
	}
	return `${timestamp} ${label} ${info.level}: ${info.message}`;
});

export const jsonFormat = winston.format.printf(({ timestamp, label, level, message, stack, details }) => {
	return JSON.stringify(
		{
			timestamp,
			label,
			level,
			message,
			stack: stack || undefined,
			details: details || undefined,
		},
		null,
		2
	);
});

export const createDailyRotateFileTransport = (level: string, logDir: string) =>
		process.env.MODE === 'production' && new winstonDailyRotateFile({
		filename: path.join(logDir, level, `application-${level}-%DATE%.log`),
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxFiles: '14d',
		format: winston.format.combine(
			winston.format((info) => (info.level === level ? info : false))(),
			jsonFormat
		),
	});
