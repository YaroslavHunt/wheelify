import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { userProviders } from './user.provider';
import User from './model/user.model';
import { UserValidationService } from './user.validation.service';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	providers: [UserService, UserValidationService, ...userProviders],
	controllers: [UserController],
	exports: [UserService, UserValidationService],
})
export class UserModule {}
