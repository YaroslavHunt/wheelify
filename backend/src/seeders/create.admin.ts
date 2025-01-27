import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app/app.module';
import { UserService } from '../modules/user/user.service';
import { CreateUserDto } from '../modules/user/dto/create.user.dto';
import { Role } from '../common/enums';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '../modules/logger/logger.service';

async function createAdmin(): Promise<void> {
	const app = await NestFactory.createApplicationContext(AppModule);
	const userService = app.get<UserService>(UserService);
	const logger = new WinstonLoggerService('Administrator');
	const configService = app.get<ConfigService>(ConfigService);

	const adminUsername = configService.get<string>('admin.username');
	const adminEmail = configService.get<string>('admin.email');
	const adminPassword = configService.get<string>('admin.password');

	if (!adminEmail || !adminPassword) {
		logger.error('Missing administrator email or password in configuration. (Look at .env-example)');
		await app.close();
		return;
	}

	try {
		const existingAdmin = await userService.findUserBy({ email: adminEmail });
		if (existingAdmin) {
			logger.error('Administrator already exists. No action taken');
		} else {
			const adminDto: CreateUserDto = {
				username: adminUsername,
				email: adminEmail,
				password: adminPassword,
				role: Role.ADMIN,
			};

			await userService.createUser(adminDto);
			logger.log('Administrator created successfully!');
		}
	} catch (e) {
		logger.error(e.message);
	} finally {
		await app.close();
	}
}

(async (): Promise<void> => {
	await createAdmin();
})();
