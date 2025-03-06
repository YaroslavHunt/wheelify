import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import TimeDocument from '@/modules/document/model/time-document.model'
import User from '@/modules/user/model/user.model'

import { UserModule } from '../user/user.module'

import { TimeDocumentController } from './time-document.controller'
import { TimeDocumentService } from './time-document.service'

@Module({
	imports: [SequelizeModule.forFeature([TimeDocument, User]), UserModule],
	controllers: [TimeDocumentController],
	providers: [TimeDocumentService]
})
export class TimeDocumentModule {}
