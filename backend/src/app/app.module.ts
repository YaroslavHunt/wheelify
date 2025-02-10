import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user/user.module';
import { AuthModule } from '../modules/auth/auth.module';
import { TokenModule } from '../modules/token/token.module';
import { AdsModule } from '../modules/advertisements/ads.module';
import { ConfigModule } from '@nestjs/config';
import configurations from '../config';
import { IDatabaseModule } from '../database/database.module';
import { LoggerModule } from '../logger/logger.module';
import { AdminModule } from '../modules/admin/admin.module';
import { ISequelizeModule } from '../database/sequelize/sequelize.module';
import { IRedisModule } from '../redis/redis.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configurations],
		}),
		IRedisModule,
		IDatabaseModule,
		AuthModule,
		TokenModule,
		AdminModule,
		UserModule,
		AdsModule,
		LoggerModule,
		ISequelizeModule,
	],
})
export class AppModule {}
