import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import User from './model/user.model'
import { UserService } from './user.service'
import { UserValidationModule } from './user-validation/user-validation.module'

@Module({
	imports: [
		SequelizeModule.forFeature([User]),
		UserValidationModule
	],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
