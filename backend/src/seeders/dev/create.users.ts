import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../modules/app/app.module';
import { UserService } from '../../modules/user/user.service';
import { CreateUserDto } from '../../modules/user/dto/create.user.dto';
import { WinstonLoggerService } from '../../modules/logger/logger.service';

async function createUsers(): Promise<void> {
	const app = await NestFactory.createApplicationContext(AppModule);
	const userService = app.get<UserService>(UserService);
	const logger = app.get<WinstonLoggerService>(WinstonLoggerService);
	logger.setLabel('Seed: Create Users');

	const users: Array<CreateUserDto> = [
		{
			username: 'jane_martin',
			email: 'jane.martin1@example.com',
			password: 'JanMar123',
		},
		{
			username: 'laura_johnson',
			email: 'laura.johnson2@example.com',
			password: 'LauJoh123',
		},
		{
			username: 'jane_johnson',
			email: 'jane.johnson3@example.com',
			password: 'JanJoh123',
		},
		{
			username: 'daniel_anderson',
			email: 'daniel.anderson4@example.com',
			password: 'DanAnd123',
		},
		{
			username: 'laura_martin',
			email: 'laura.martin5@example.com',
			password: 'LauMar123',
		},
		{
			username: 'jane_martin',
			email: 'jane.martin6@example.com',
			password: 'JanMar123',
		},
		{
			username: 'emma_johnson',
			email: 'emma.johnson7@example.com',
			password: 'EmmJoh123',
		},
		{
			username: 'john_smith',
			email: 'john.smith8@example.com',
			password: 'JohSmi123',
		},
		{
			username: 'jane_jackson',
			email: 'jane.jackson9@example.com',
			password: 'JanJac123',
		},
		{
			username: 'chris_harris',
			email: 'chris.harris10@example.com',
			password: 'ChrHar123',
		},
	];

	try {
		for (const user of users) {
			logger.log(`Creating user: ${user.username}`);
			await userService.createUser(user);
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
