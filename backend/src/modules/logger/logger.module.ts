import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './logger.service';

@Global()
@Module({
	providers: [
		{
			provide: WinstonLoggerService,
			useFactory: () => new WinstonLoggerService(),
		},
	],
	exports: [WinstonLoggerService],
})
export class LoggerModule {}
