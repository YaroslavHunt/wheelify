import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import User from '../user/model/user.model'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserService } from '@/modules/user/user.service'
import { UserValidService } from '@/modules/user/user-validation.service'
import { StorageService } from '@/storage/storage.service'
import { UserModule } from '@/modules/user/user.module'

@Module({
	imports: [UserModule, SequelizeModule.forFeature([User])],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserService,
		UserValidService,
		StorageService,
	]
})
export class AuthModule {}
