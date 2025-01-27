import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { setupSwagger } from './config/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from './modules/logger/logger.service';
import { ErrExFilter } from './filters/error/all.err.filter';

async function bootstrap() {
	const app = await NestFactory.create<INestApplication<AppModule>>(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get<number>('app.port');
	const domains = configService.get<string[]>('security.domains');
	const logger = app.get(WinstonLoggerService);
	const httpAdapterHost = app.get<HttpAdapterHost>(HttpAdapterHost);

	// Security Middleware
	app.enableCors({
		origin: domains,
		credentials: true
	});

	// Logger
	app.useLogger(logger);

	// Filters
	app.useGlobalFilters(new ErrExFilter(httpAdapterHost, logger));

	// Pipes
	app.useGlobalPipes(new ValidationPipe());

	// API
	app.setGlobalPrefix('api/v1');
	setupSwagger(app);

	// Start server
	await app.listen(port);
}

bootstrap().catch((e: Error) => {
	const logger = new WinstonLoggerService();
	logger.error(e.message);
});


