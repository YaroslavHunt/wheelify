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
import Equipment from '@/modules/equipment/model/equipment.model'

import { EquipmentDto } from './dto/equipment.dto'
import { EquipmentService } from './equipment.service'

@ApiTags('Equipment')
@Controller('equipments')
export class EquipmentController {
	constructor(private readonly equipmentService: EquipmentService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, type: [Equipment] })
	@Get()
	public async getUserEquipment(@Authorized('id') id: string) {
		return this.equipmentService.getUserEquipment(id)
	}

	@Authorization(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, type: [Equipment] })
	@Get('by-user-id/:id')
	public async findById(@Param('id') id: string) {
		return this.equipmentService.getUserEquipment(id)
	}

	@Authorization()
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({ status: HttpStatus.CREATED })
	@Post('add')
	public async createUserEquipment(
		@Authorized('id') id: string,
		@Body() data: EquipmentDto
	) {
		return this.equipmentService.createEquipment(id, data.model, data.type)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, type: Boolean })
	@Delete('delete/:equipmentId')
	public async deleteUserEquipment(
		@Authorized('id') id: string,
		@Param('equipmentId') equipmentId: string
	) {
		return this.equipmentService.deleteEquipment(id, equipmentId)
	}
}
