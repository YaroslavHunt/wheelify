import { RedisConfig } from '../config.types';

export default (): RedisConfig => ({
	url: process.env.REDIS_URL || 'redis://localhost:6379',
});
