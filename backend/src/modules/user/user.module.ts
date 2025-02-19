import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import User from './model/user.model'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserValidService } from './user-validation.service'
import Account from '@/modules/auth/model/account.model'
import Token from '../token/model/token.model'
import { StorageService } from '@/libs/storage/storage.service'

@Module({
	imports: [SequelizeModule.forFeature([User, Account, Token])], // TODO
	providers: [UserService, UserValidService],
	controllers: [UserController],
	exports: [UserService, UserValidService]
})
export class UserModule {}
