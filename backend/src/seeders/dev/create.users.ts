import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { CreateUserDto } from '../../modules/auth/dto/create.user.dto';
import { WinstonLoggerService } from '../../modules/logger/logger.service';
import User from '../../modules/user/model/user.model';
import { Sequelize } from 'sequelize-typescript';

async function createUsers(): Promise<void> {
	const app = await NestFactory.createApplicationContext(AppModule);
	const sequelize = app.get<Sequelize>(Sequelize);
	const userRepository = sequelize.getRepository(User);
	const logger = app.get<WinstonLoggerService>(WinstonLoggerService);
	logger.setLabel('Seed: Create Users');

	const users: Array<CreateUserDto> = [
		{
			username: 'Jane',
			email: 'jane.martin1@example.com',
			password: 'qwerty123',
		},
		{
			username: 'Laura',
			email: 'laura@example.com',
			password: 'qwerty123',
		},
		{
			username: 'April',
			email: 'april.johnson3@example.com',
			password: 'qwerty123',
		},
		{
			username: 'Daniel',
			email: 'danny@example.com',
			password: 'qwerty123',
		},
		{
			username: 'Josh',
			email: 'joshy.coppola@example.com',
			password: 'qwerty123',
		},
		{
			username: 'Dilan',
			email: 'dilan@example.com',
			password: 'qwerty123',
		},
		{
			username: 'Emma',
			email: 'emma.johnson7@example.com',
			password: 'qwerty123',
		},
		{
			username: 'John',
			email: 'john.smith8@example.com',
			password: 'qwerty123',
		},
		{
			username: 'Bob',
			email: 'bobby@example.com',
			password: 'qwerty123',
		},
		{
			username: 'Chris',
			email: 'chris.harris10@example.com',
			password: 'qwerty123',
		},
	];

	try {
		for (const user of users) {
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
	await createUsers();
})();
