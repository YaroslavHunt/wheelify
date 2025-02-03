import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class TransactionHelper {
	constructor(private readonly sequelize: Sequelize) {}

	async run<T>(callback: (t: Transaction) => Promise<T>): Promise<T> {
		const t = await this.sequelize.transaction();
		try {
			const result = await callback(t);
			await t.commit();
			return result;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}
}
