import { Global, Module } from '@nestjs/common'

import { WinstonLoggerService } from './logger.service'
import { LoggingInterceptor } from '@/libs/logger/logger-interceptor.service'

@Global()
@Module({
	providers: [WinstonLoggerService, LoggingInterceptor],
	exports: [WinstonLoggerService, LoggingInterceptor]
})
export class LoggerModule {}
