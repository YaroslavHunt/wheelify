import { ConfigService } from '@nestjs/config';

export const isDev = (configService: ConfigService) =>
	configService.get<string>('NODE_ENV') === 'development';

export const IS_DEV = process.env.NODE_ENV === 'development';
