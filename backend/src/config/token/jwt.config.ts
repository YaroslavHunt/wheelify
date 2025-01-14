import { JwtConfig } from '../config.types';

export default (): JwtConfig => ({
		secret: process.env.JWT_SECRET,
		expire: process.env.JWT_EXPIRE_TIME || '24h',
});
