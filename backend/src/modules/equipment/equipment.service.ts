import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import Equipment from './model/equipment.model'

@Injectable()
export class EquipmentService {
	constructor(
		@InjectModel(Equipment)
		private readonly equipmentRepository: typeof Equipment
	) {}

	public async createEquipment(
		userId: string,
		model: string,
		type: string
	): Promise<Equipment> {
		return this.equipmentRepository.create({
			userId,
			model,
			type
		})
	}

	public async getUserEquipment(userId: string): Promise<Equipment[]> {
		return this.equipmentRepository.findAll({
			where: { userId }
		})
	}

	public async deleteEquipment(
		userId: string,
		equipmentId: string
	): Promise<boolean> {
		const equipment = await this.equipmentRepository.findOne({
			where: { id: equipmentId, userId }
		})

		if (equipment) {
			await equipment.destroy()
			return true
		}

		return false
	}
}
