import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { AdsModule } from '../advertisements/ads.module';
import { ConfigModule } from '@nestjs/config';
import configurations from '../../config';
import { DatabaseModule } from '../../database/database.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configurations],
		}),
		DatabaseModule,
		AuthModule,
		TokenModule,
		UserModule,
		AdsModule,
		LoggerModule,
	],
})
export class AppModule {}
