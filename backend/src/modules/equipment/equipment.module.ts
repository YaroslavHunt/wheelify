import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import User from '../user/model/user.model'
import { UserModule } from '../user/user.module'

import { EquipmentController } from './equipment.controller'
import { EquipmentService } from './equipment.service'
import Equipment from './model/equipment.model'

@Module({
	imports: [SequelizeModule.forFeature([Equipment, User]), UserModule],
	controllers: [EquipmentController],
	providers: [EquipmentService]
})
export class EquipmentModule {}
