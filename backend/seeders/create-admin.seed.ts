import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as bcrypt from 'bcrypt'
import { Sequelize } from 'sequelize-typescript'

import { AppModule } from '@/app/app.module'
import { Role } from '@/libs/common/enums'
import { WinstonLoggerService } from '@/libs/logger/logger.service'
import User from '@/modules/user/model/user.model'
import { SequelizeConfigService } from '@/database/sequelize/sequelize-config.service'
import { AdminEnv } from '@/config/enums'

async function createAdmin() {
	const app = await NestFactory.createApplicationContext(AppModule)

	const config = app.get(ConfigService)
	const sequelizeConfigService = app.get(SequelizeConfigService)
	const sequelizeOptions = sequelizeConfigService.createSequelizeOptions()
	const sequelize = new Sequelize(sequelizeOptions)
	sequelize.addModels([User])

	const logger = app.get(WinstonLoggerService)

	const adminUsername = config.getOrThrow<string>(AdminEnv.USERNAME)
	const adminEmail = config.getOrThrow<string>(AdminEnv.EMAIL)
	const adminPassword = config.getOrThrow<string>(AdminEnv.PASSWORD)

	if (!adminEmail || !adminPassword) {
		await app.close()
	}

	try {
		await sequelize.authenticate()
		const isExist = await User.findOne({ where: { email: adminEmail } })
		if (isExist) {
			logger.warn('Administrator already exists. No action taken')
		} else {
			const hashedPassword = await bcrypt.hash(adminPassword, 12)

			await sequelize.transaction(async t => {
				await User.create(
					{
						username: adminUsername,
						password: hashedPassword,
						email: adminEmail,
						role: Role.ADMIN
					},
					{ transaction: t }
				)
			})

			logger.log('Administrator created successfully!')
		}
	} catch (e) {
		logger.error('Error while creating administrator', e)
	} finally {
		await sequelize.close()
		await app.close()
	}
}

;(async () => {
	await createAdmin()
})()
