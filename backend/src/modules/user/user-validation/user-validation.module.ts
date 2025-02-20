import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import User from '../model/user.model'
import { UserValidService } from './user-validation.service'

@Module({
	imports: [SequelizeModule.forFeature([User])],
	providers: [UserValidService],
	exports: [UserValidService]
})
export class UserValidationModule {}
