import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { JwtStrategy } from '@/strategy/jwt.strategy'
import { TokenModule } from '../token/token.module'
import User from '../user/model/user.model'
import { UserModule } from '../user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { StorageService } from '@/storage/storage.service'

@Module({
	imports: [UserModule, TokenModule, SequelizeModule.forFeature([User])],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, StorageService]
})
export class AuthModule {}
