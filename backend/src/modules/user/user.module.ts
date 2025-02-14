import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import User from './model/user.model'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserValidService } from './user-validation.service'
import Account from '@/modules/user/model/account.model'
import Token from '../token/model/token.model'
import { StorageService } from '@/storage/storage.service'

@Module({
	imports: [SequelizeModule.forFeature([User, Account, Token])], // TODO
	providers: [UserService, UserValidService, StorageService],
	controllers: [UserController],
	exports: [UserService, UserValidService]
})
export class UserModule {}
