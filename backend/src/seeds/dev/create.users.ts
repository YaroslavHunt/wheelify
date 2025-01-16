import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../modules/app/app.module';
import { UserService } from '../../modules/user/user.service';
import { CreateUserDto } from '../../modules/user/dto/create.user.dto';
import { Role } from '../../common/enums';

async function createUsers(): Promise<void> {
	const app = await NestFactory.createApplicationContext(AppModule);
	const userService = app.get(UserService);

	const users: Array<CreateUserDto> = [
		{
			username: 'jane_martin',
			email: 'jane.martin1@example.com',
			password: 'JanMar123',
			role: 'user' as Role,
		},
		{
			username: 'laura_johnson',
			email: 'laura.johnson2@example.com',
			password: 'LauJoh123',
			role: 'user' as Role,
		},
		{
			username: 'jane_johnson',
			email: 'jane.johnson3@example.com',
			password: 'JanJoh123',
			role: 'user' as Role,
		},
		{
			username: 'daniel_anderson',
			email: 'daniel.anderson4@example.com',
			password: 'DanAnd123',
			role: 'user' as Role,
		},
		{
			username: 'laura_martin',
			email: 'laura.martin5@example.com',
			password: 'LauMar123',
			role: 'user' as Role,
		},
		{
			username: 'jane_martin',
			email: 'jane.martin6@example.com',
			password: 'JanMar123',
			role: 'user' as Role,
		},
		{
			username: 'emma_johnson',
			email: 'emma.johnson7@example.com',
			password: 'EmmJoh123',
			role: 'user' as Role,
		},
		{
			username: 'john_smith',
			email: 'john.smith8@example.com',
			password: 'JohSmi123',
			role: 'user' as Role,
		},
		{
			username: 'jane_jackson',
			email: 'jane.jackson9@example.com',
			password: 'JanJac123',
			role: 'user' as Role,
		},
		{
			username: 'chris_harris',
			email: 'chris.harris10@example.com',
			password: 'ChrHar123',
			role: 'user' as Role,
		},
	];

	try {
		for (const user of users) {
			console.log(`Creating user: ${user.username}`);
			await userService.createUser(user);
		}
		console.log('Users created successfully.');
	} catch (e) {
		console.error('Error while creating users:', e);
	}

	await app.close();
}

(async (): Promise<void> => {
	await createUsers();
})();
