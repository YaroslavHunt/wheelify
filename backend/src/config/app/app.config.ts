import { AppConfig } from '../config.types';
import * as process from 'node:process';
import { Mode } from '../../common/types';

export default (): AppConfig => ({
		mode: (process.env.MODE as Mode) || 'development',
		port: +process.env.APP_PORT || 3001,
});
