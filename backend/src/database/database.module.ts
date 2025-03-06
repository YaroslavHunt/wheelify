import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { SequelizeConfigService } from '@/database/sequelize/sequelize-config.service'

@Module({
	imports: [
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useClass: SequelizeConfigService
		})
	],
	exports: [SequelizeModule]
})
export class DatabaseModule {}
