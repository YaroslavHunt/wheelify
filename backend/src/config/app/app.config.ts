import { AppConfig } from '../config.types';
import * as process from 'node:process';
import { Mode } from '../../common/constants';

export default (): AppConfig => ({
	mode: (process.env.MODE as Mode) || Mode.DEV,
	port: +process.env.APP_PORT || 3001,
});
