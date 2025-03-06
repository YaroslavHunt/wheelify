import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import TimeDocument from './model/time-document.model'

@Injectable()
export class TimeDocumentService {
	constructor(
		@InjectModel(TimeDocument)
		private readonly timeDocumentRepository: typeof TimeDocument
	) {}

	public async createDocument(
		userId: string,
		number: string,
		series: string
	): Promise<TimeDocument> {
		return this.timeDocumentRepository.create({
			userId,
			number,
			series
		})
	}

	public async getUserDocument(userId: string): Promise<TimeDocument | null> {
		return this.timeDocumentRepository.findOne({ where: { userId } })
	}

	public async deleteDocument(userId: string) {
		const document = await this.getUserDocument(userId)
		if (document) {
			await document.destroy()
			return true
		}
		return false
	}
}
