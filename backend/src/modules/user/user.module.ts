import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import User from './model/user.model';
import { UserValidService } from './user.validation.service';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	providers: [UserService, UserValidService],
	controllers: [UserController],
	exports: [UserService, UserValidService],
})
export class UserModule {}
