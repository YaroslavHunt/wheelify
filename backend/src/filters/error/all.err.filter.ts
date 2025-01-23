import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpExceptionBody,
	HttpExceptionBodyMessage,
	HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { WinstonLoggerService } from '../../modules/logger/logger.service';

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

		const responseBody = {
			statusCode: status,
			errorType: e instanceof Error ? e.name : 'Error',
			timestamp: new Date().toISOString(),
			method: httpAdapter.getRequestMethod(req),
			path: httpAdapter.getRequestUrl(req),
			message: e instanceof HttpException ? this.extractMessage(e) : e.message,
		};

		this.logger.error(
			`[${req.method}] ${req.url} - ${responseBody.message}` //TODO
		);
		res.status(status).json(responseBody);
	}

	private extractMessage(e: unknown): HttpExceptionBodyMessage {
		if (e instanceof HttpException) {
			const response = e.getResponse();
			return typeof response === 'object' && response !== null
				? (response as HttpExceptionBody).message || 'No message provided'
				: (response as string);
		}

		return e instanceof Error ? e.message : 'An unknown error occurred';
	}

}
