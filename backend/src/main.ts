import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'

import { setupSwagger } from '@/config/swagger/swagger.config'
import { RedisConfigService } from '@/libs/redis/redis.service'

import { AppModule } from './app/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)
	const redis = app.get(RedisConfigService)

	const port = config.getOrThrow<number>('APP_PORT')
	const client = config.getOrThrow<string>('ALLOWED_ORIGIN')
	const cookieSecret = config.getOrThrow<string>('COOKIES_SECRET')
	const globalPrefix = config.getOrThrow<string>('APP_GLOBAL_PREFIX')

	// CORS
	app.enableCors({
		origin: client,
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

	// Cookies
	app.use(cookieParser(cookieSecret))

	// Redis
	app.use(session(redis.getSessionConfig()))

	// API
	app.setGlobalPrefix(globalPrefix)
	setupSwagger(app)

	await app.listen(port)
}

bootstrap().catch((e: Error) => {
	console.log(e.message)
})
