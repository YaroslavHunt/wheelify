import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AdsController } from './ads.controller'
import { AdsService } from './ads.service'
import Ads from './model/ads.model'

@Module({
	imports: [SequelizeModule.forFeature([Ads])],
	controllers: [AdsController],
	providers: [AdsService]
})
export class AdsModule {}
