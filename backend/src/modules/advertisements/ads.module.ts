import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { SequelizeModule } from '@nestjs/sequelize';
import Ads from './model/ads.model';

@Module({
	imports: [SequelizeModule.forFeature([Ads])],
	controllers: [AdsController],
	providers: [AdsService],
})
export class AdsModule {}
