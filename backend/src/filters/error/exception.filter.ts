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
		let errors = null

		if (e instanceof HttpException) {
			status = e.getStatus()
			const exceptionRes = e.getResponse()

			if (typeof exceptionRes === 'object' && exceptionRes !== null) {
				message = exceptionRes['message'] || 'Bad Request'
				errors = exceptionRes['errors'] || null
			} else {
				message = String(exceptionRes)
			}
		}

		const details = `Exception: ${message}\nURL - ${request.url}\tMethod - ${request.method}\tStatus - ${status}\tIP - ${request.ip}\tUser - ${request.user?.id || 'Anonymous'}`

		this.logger.error(details)

		response.status(status).json({
			status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
			errors,
		})
	}
}
