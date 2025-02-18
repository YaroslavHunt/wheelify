import { NestFactory } from '@nestjs/core'
import * as bcrypt from 'bcrypt'


import { AppModule } from '@/app/app.module'
import { faker } from '@faker-js/faker'
import { WinstonLoggerService } from '@/logger/logger.service'
import User from '../../modules/user/model/user.model'
import { ConfigService } from '@nestjs/config'
import { SequelizeConfigService } from '@/database/sequelize/sequelize-config.service'
import { Sequelize } from 'sequelize-typescript'
import { Role } from '@/libs/common/enums'

async function createUsers(userCount: number){
	const app = await NestFactory.createApplicationContext(AppModule)

	const config = app.get(ConfigService);
	const sequelizeConfigService  = app.get(SequelizeConfigService)
	const sequelizeOptions = sequelizeConfigService.createSequelizeOptions();
	const sequelize = new Sequelize(sequelizeOptions);
	sequelize.addModels([User])

	const logger = app.get(WinstonLoggerService)

	try {
		await sequelize.authenticate()
		for (let i = 0; i < userCount; i++) {
			const user = {
				username: faker.internet.username(),
				password: await bcrypt.hash('qwerty123', 12),
				email: faker.internet.email(),
				role: Role.USER
			}
			await User.create(user)
			logger.log(`Creating user: ${user.username}...`)
		}
		logger.log('Users created successfully.')
	} catch (e) {
		logger.error('Error while creating users:', e)
	} finally {
		await sequelize.close()
		await app.close()
	}
}

(async ()=> {
	const userCount = process.argv[2] ? parseInt(process.argv[2], 10) : 10
	await createUsers(userCount)
})()
