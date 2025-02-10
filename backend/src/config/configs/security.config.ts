import { SecurityConfig } from '../config.types';

export default (): SecurityConfig => {
	const raw = process.env.ENABLE_DOMAINS;
	const domains = raw ? raw.split(',')
		.map(domain => domain.trim()) : [];

	return { domains };
};
