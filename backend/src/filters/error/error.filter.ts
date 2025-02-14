import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { WinstonLoggerService } from '@/logger/logger.service'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: WinstonLoggerService) {
	}

	catch(e: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()
		const status = e instanceof HttpException ? e.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

		const details = `Exception: ${e.message}\nURL - ${request.url}\tMethod - ${request.method}\tStatus - ${status}\tIP - ${request.ip}\tUser - ${request.user?.id || 'Anonymous'}`;

		this.logger.error(details)

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message: e.message
		})
	}
}
