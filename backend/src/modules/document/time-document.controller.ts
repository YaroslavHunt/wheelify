import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { Role } from '@/common/enums'
import { Authorization } from '@/modules/auth/decorators/auth.decorator'
import { Authorized } from '@/modules/auth/decorators/authorized.decorator'
import { DocumentDto } from '@/modules/document/dto/time-document.dto'

import { TimeDocumentService } from './time-document.service'

@ApiTags('Time-Document')
@Controller('time-document')
export class TimeDocumentController {
	constructor(private readonly documentService: TimeDocumentService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Get()
	public async findProfile(@Authorized('id') id: string) {
		return await this.documentService.getUserDocument(id)
	}

	@Authorization(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Get('by-user-id/:id')
	public async findById(@Param('id') id: string) {
		return this.documentService.getUserDocument(id)
	}

	@Authorization()
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({ status: HttpStatus.CREATED })
	@Post('add')
	public async createUserDocument(
		@Authorized('id') id: string,
		@Body() data: DocumentDto
	) {
		return this.documentService.createDocument(id, data.number, data.series)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: 200, type: Boolean })
	@Delete('delete')
	public async deleteUser(@Authorized('id') id: string) {
		return this.documentService.deleteDocument(id)
	}
}
