import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app/app.module'
import { setupSwagger } from '@/config/configurations/swagger.config'
import { GlobalExceptionFilter } from './filters/error/exception.filter'
import { WinstonLoggerService } from './logger/logger.service'
import * as session from 'express-session'
import { AppEnv, SecurityEnv } from '@/config/enums'
import { LoggingInterceptor } from '@/logger/logger-interceptor.service'
import { RedisConfigService } from '@/redis/redis.service'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true })
	const logger = app.get(WinstonLoggerService)
	const config = app.get(ConfigService)
	const redis = app.get(RedisConfigService)

	const port = config.getOrThrow<number>(AppEnv.PORT)
	const domains = config.getOrThrow<string[]>(SecurityEnv.DOMAINS)
	const cookieSecret = config.getOrThrow<string>(SecurityEnv.COOKIES_SECRET)

	// Security
	app.enableCors({
		origin: domains,
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	// Pipes
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	)

	// Logger
	app.useLogger(logger)

	// Interceptors
	app.useGlobalInterceptors(new LoggingInterceptor(logger))

	// Filters
	app.useGlobalFilters(new GlobalExceptionFilter(logger))

	// Cookies
	app.use(cookieParser(cookieSecret))

	// Redis
	app.use(session(redis.getSessionConfig()))

	// API
	app.setGlobalPrefix('api/v1')
	setupSwagger(app)

	await app.listen(port)
}

bootstrap().catch((e: Error) => {
	console.log(e.message)
})
