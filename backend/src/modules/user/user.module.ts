import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { userProviders } from './user.provider';
import User from './models/user.model';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	providers: [UserService, ...userProviders],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
