import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { WinstonLoggerService } from '../../modules/logger/logger.service';
import { LogError } from '../../modules/logger/types/log.types';

@Catch()
export class ErrExFilter implements ExceptionFilter {

	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly logger: WinstonLoggerService,
	) {
	}

	catch(e: Error, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();
		const res: Response = ctx.getResponse();
		const req: Request = ctx.getRequest();

		const status: number =
			e instanceof HttpException
				? e.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		let message: string = e.message;
		if (e instanceof HttpException) {
			const response = e.getResponse();
			message = (response as any).message || message;
		}

		const name: string = e.name;
		const stack: string = e.stack;

		const responseBody = {
			status,
			name,
			timestamp: new Date().toISOString(),
			method: httpAdapter.getRequestMethod(req),
			path: httpAdapter.getRequestUrl(req),
			message,
		};

		const logDetails: LogError = {
			name,
			message: Array.isArray(message) ? message.join(',\n') : message,
			stack,
			details: {
				method: req.method,
				url: req.url,
				hostname: httpAdapter.getRequestHostname(req),
				status,
			},
		};

		const logMethod = e instanceof HttpException ? 'warn' : 'error';
		this.logger[logMethod](message, logDetails);

		res.status(status).json(responseBody);
	}
}
