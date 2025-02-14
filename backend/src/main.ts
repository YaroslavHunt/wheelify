import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import IORedis from 'ioredis'
import { AppModule } from './app/app.module'
import { setupSwagger } from '@/config/configurations/swagger.config'
import { GlobalExceptionFilter } from './filters/error/error.filter'
import { WinstonLoggerService } from './logger/logger.service'
import * as session from 'express-session'
import { ms, StringValue } from '@/libs/common/utils/ms.utils'
import { RedisStore } from 'connect-redis'
import { AppEnv, RedisEnv, SecurityEnv } from '@/config/enums'
import { LoggingInterceptor } from '@/logger/logger-interceptor.service'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true })
	const logger = app.get(WinstonLoggerService)
	const config = app.get(ConfigService)

	const redis = new IORedis(config.getOrThrow<string>(RedisEnv.URI))
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
	app.use(session({
		secret: config.getOrThrow<string>('session.secret'),
		name: config.getOrThrow<string>('session.name'),
		resave: true,
		saveUninitialized: false,
		cookie: {
			domain: config.getOrThrow<string>('session.domain'),
			maxAge: ms(config.getOrThrow<StringValue>('session.maxAge')),
			httpOnly: config.getOrThrow<boolean>('session.httpOnly'),
			secure: config.getOrThrow<boolean>('session.secure'),
			sameSite: 'lax'
		},
		store: new RedisStore({
			client: redis,
			prefix: config.getOrThrow<string>('session.folder')
		})
	}))

	// API
	app.setGlobalPrefix('api/v1')
	setupSwagger(app)

	await app.listen(port)
}

bootstrap().catch((e: Error) => {
	console.log(e.message)
})
