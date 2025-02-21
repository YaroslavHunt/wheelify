import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from '@/database/sequelize/sequelize-config.service'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useClass: SequelizeConfigService,
		})
	],
	exports: [SequelizeModule],
})
export class DatabaseModule {}
