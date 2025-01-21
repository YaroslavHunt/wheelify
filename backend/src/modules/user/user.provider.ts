import User from './model/user.model';
import { Provider } from '@nestjs/common';

export const userProviders: Provider[] = [
	{
		provide: 'USER_REPOSITORY',
		useValue: User,
	},
];
