import Ads from './model/ads.model';

export const adsProviders = [
	{
		provide: 'ADS_REPOSITORY',
		useValue: Ads,
	},
];
