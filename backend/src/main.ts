import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { setupSwagger } from './config/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from './modules/logger/logger.service';

async function bootstrap() {
	const app = await NestFactory.create<INestApplication<AppModule>>(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get<number>('app.port');
	const domains = configService.get<string[]>('security.domains');
	const logger = app.get(WinstonLoggerService);

	// Security Middleware
	app.enableCors({
		origin: domains,
		credentials: true
	});

	// Logger
	app.useLogger(logger);

	// Global Validation
	app.useGlobalPipes(new ValidationPipe());

	// API Version Prefix
	app.setGlobalPrefix('api/v1');

	// Swagger Setup
	setupSwagger(app);

	// Start server
	await app.listen(port);
}

bootstrap().catch((e: Error) => {
	const logger = new WinstonLoggerService();
	logger.error(e.message, e.stack, 'App');
});


