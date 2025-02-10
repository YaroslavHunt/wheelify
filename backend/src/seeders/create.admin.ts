import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app/app.module';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '../logger/logger.service';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums';
import User from '../modules/user/model/user.model';

async function createAdmin(): Promise<void> {
	const app = await NestFactory.createApplicationContext(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const sequelize = app.get<Sequelize>(Sequelize);
	const userRepository = sequelize.getRepository(User);
	const logger = app.get<WinstonLoggerService>(WinstonLoggerService);
	logger.setLabel('Administrator');

	const adminUsername = configService.get<string>('admin.username');
	const adminEmail = configService.get<string>('admin.email');
	const adminPassword = configService.get<string>('admin.password');

	if (!adminEmail || !adminPassword) {
		logger.warn('Missing administrator email or password in configuration. (Look at .env-example)');
		await app.close();
		return;
	}

	try {
		const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });
		if (existingAdmin) {
			logger.warn('Administrator already exists. No action taken');
		} else {
			const hashedPassword = await bcrypt.hash(adminPassword, 12);

			await sequelize.transaction(async (t) => {
				await userRepository.create({
					username: adminUsername,
					email: adminEmail,
					password: hashedPassword,
					role: Role.ADMIN,
				}, { transaction: t });
			});

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
