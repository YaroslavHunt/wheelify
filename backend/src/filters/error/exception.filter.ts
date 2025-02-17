import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { WinstonLoggerService } from '@/logger/logger.service'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: WinstonLoggerService) {}

	catch(e: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest()

		let status = HttpStatus.INTERNAL_SERVER_ERROR
		let message = 'Internal Server Error'

		if (e instanceof HttpException) {
			status = e.getStatus()
			const exceptionRes = e.getResponse()
			message = typeof exceptionRes === 'object' ? exceptionRes['message'] || 'Bad Request' : String(exceptionRes)
		} else if (e instanceof Error) {
			message = e.message
		}

		const details = `${message}\nURL - ${request.url}\nMethod - ${request.method}\tStatus - ${status}\tIP - ${request.ip}\tUser - ${request.user?.id || 'Anonymous'}`

		this.logger.error(details)

		response.status(status).json({
			status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
		})
	}
}
