import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import User from '../user/model/user.model';
import { AdminController } from "./admin.controller";
import { AdminService } from './admin.service';


@Module({
	imports: [SequelizeModule.forFeature([User])],
	providers: [AdminService],
	controllers: [AdminController],
	exports: [AdminService],
})
export class AdminModule {}
