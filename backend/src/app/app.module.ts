import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user/user.module';
import { AuthModule } from '../modules/auth/auth.module';
import { TokenModule } from '../modules/token/token.module';
import { AdsModule } from '../modules/advertisements/ads.module';
import { ConfigModule } from '@nestjs/config';
import configurations from '../config';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../modules/logger/logger.module';
import { AdminModule } from '../modules/admin/admin.module';
import { CommonModule } from '../common/common.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configurations],
		}),
		DatabaseModule,
		AuthModule,
		TokenModule,
		AdminModule,
		UserModule,
		AdsModule,
		LoggerModule,
		CommonModule,
	],
})
export class AppModule {}
