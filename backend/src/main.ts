import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { setupSwagger } from './config/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const port = configService.get<number>('app.port');
	const domains = configService.get<string[]>('security.domains');

	// Security Middleware
	app.enableCors({
		origin: domains,
		credentials: true
	});

	// Logger
	app.useLogger(new Logger());

	// Global Validation
	app.useGlobalPipes(new ValidationPipe());

	// API Version Prefix
	app.setGlobalPrefix('api/v1');

	// Swagger Setup
	setupSwagger(app);

	// Start server
	await app.listen(port);
}
bootstrap();
