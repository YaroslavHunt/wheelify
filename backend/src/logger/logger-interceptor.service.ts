import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { WinstonLoggerService } from '@/logger/logger.service'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: WinstonLoggerService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		const method = req.method;
		const url = req.originalUrl;
		const ip = req.ip;
		const user = req.user?.id || 'Anonymous';
		const controller = context.getClass().name;

		this.logger.setContext(controller || 'Request');
		this.logger.log(`Incoming request: ${method} ${url} - User: ${user} - IP: ${ip}`);

		const start = Date.now();
		return next.handle().pipe(
			tap(() => {
				const duration = Date.now() - start;
				this.logger.log(`Completed request: ${method} ${url} - ${duration}ms`);
			})
		);
	}
}
