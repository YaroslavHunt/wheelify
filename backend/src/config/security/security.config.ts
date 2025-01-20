import { SecurityConfig } from '../config.types';

const domains: string[] = process.env.ENABLE_DOMAINS.split(',');

export default (): SecurityConfig => ({
	domains: domains
})