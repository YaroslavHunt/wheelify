import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { JwtStrategy } from '../../strategy/jwt.strategy';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../user/model/user.model';

@Module({
	imports: [UserModule, TokenModule, SequelizeModule.forFeature([User])],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
