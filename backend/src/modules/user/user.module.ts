import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import TimeDocument from '@/modules/document/model/time-document.model'
import Equipment from '@/modules/equipment/model/equipment.model'

import User from './model/user.model'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [SequelizeModule.forFeature([User, Equipment, TimeDocument])],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
