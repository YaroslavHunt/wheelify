import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import User from './model/user.model'
import { UserService } from './user.service'
import { UserValidationModule } from '@/modules/user/libs/user-validation/user-validation.module'
import Account from '@/modules/auth/models/account.model'
import { UserController } from '@/modules/user/user.controller'

@Module({
	imports: [
		SequelizeModule.forFeature([User, Account]),
		UserValidationModule
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
