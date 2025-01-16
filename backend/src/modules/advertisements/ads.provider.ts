import Ads from './models/ads.model';

export const adsProviders = [
	{
		provide: 'ADS_REPOSITORY',
		useValue: Ads,
	},
];
