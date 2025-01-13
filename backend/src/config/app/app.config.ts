import { AppConfig } from '../config.types';
import * as process from 'node:process';

export default (): AppConfig => ({
		nodeEnv: (process.env.NODE_ENV as 'development' | 'production') || 'development',
		port: +process.env.APP_PORT || 3001,
});
