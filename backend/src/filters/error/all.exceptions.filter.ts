import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	HttpExceptionBody,
	HttpExceptionBodyMessage,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const errorResponse = {
			statusCode: status,
			errorType: exception instanceof HttpException ? exception.name : 'InternalServerError',
			timestamp: new Date().toISOString(),
			path: request.url,
			messages: this.extractMessage(exception),
		};

		response.status(status).json(errorResponse);
	}

	private extractMessage(exception: unknown): HttpExceptionBodyMessage {
		if (exception instanceof HttpException) {
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
				const errorResponse = exceptionResponse as HttpExceptionBody;
				return errorResponse.message || 'No message provided';
			}

			return exceptionResponse as string;
		}

		if (exception instanceof Error) {
			return exception.message;
		}
		return 'An unknown error occurred';
	}


}
