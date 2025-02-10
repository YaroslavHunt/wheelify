import { AdministratorConfig } from '../config.types';
import * as process from 'node:process';

export default (): AdministratorConfig => ({
	username: process.env.ADMIN_USERNAME || 'Administrator',
	password: process.env.ADMIN_PASSWORD,
	email: process.env.ADMIN_EMAIL,
});
