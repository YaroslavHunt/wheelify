import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { WinstonLoggerService } from '../../logger/logger.service';
import User from '../../modules/user/model/user.model';
import { Sequelize } from 'sequelize-typescript';
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import { CreateUserReq } from '../../modules/user/dto/req/create.user.req';

async function createUsers(userCount: number): Promise<void> {
	const app = await NestFactory.createApplicationContext(AppModule);
	const sequelize = app.get<Sequelize>(Sequelize);
	const userRepository = sequelize.getRepository(User);
	const logger = app.get<WinstonLoggerService>(WinstonLoggerService);
	logger.setLabel('Seed:Create Users');

	try {
		for (let i = 0; i < userCount; i++) {
			const user: CreateUserReq = {
				username: faker.name.firstName(),
				email: faker.internet.email(),
				password: await bcrypt.hash('qwerty123', 12),
			};
			await userRepository.create(user);
			logger.log(`Creating user: ${user.username}`);
		}
		logger.log('Users created successfully.');
	} catch (e) {
		logger.error('Error while creating users:', e);
	}
	await app.close();
}

(async (): Promise<void> => {
	const userCount = process.argv[2] ? parseInt(process.argv[2], 10) : 10;
	await createUsers(userCount);
})();
