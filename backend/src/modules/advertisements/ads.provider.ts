import Ads from './model/ads.model';
import { Provider } from '@nestjs/common';

export const adsProviders: Provider[] = [
	{
		provide: 'ADS_REPOSITORY',
		useValue: Ads,
	},
];
