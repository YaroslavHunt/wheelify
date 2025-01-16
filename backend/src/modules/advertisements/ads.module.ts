import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { adsProviders } from './ads.provider';
import Ads from './model/ads.model';

@Module({
	imports: [SequelizeModule.forFeature([Ads])],
	controllers: [AdsController],
	providers: [AdsService, ...adsProviders],
})
export class AdsModule {}
