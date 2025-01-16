import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { AdsModule } from '../watchlist/ads.module';
import { ConfigModule } from '@nestjs/config';
import configurations from '../../config';
import { DatabaseModule } from '../../database/database.module';

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
	],
})
export class AppModule {}
