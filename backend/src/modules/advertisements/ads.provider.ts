import Ads from './model/ads.model';
import { ADS_REPOSITORY } from '../../common/constants';

export const adsProviders = [
	{
		provide: ADS_REPOSITORY,
		useValue: Ads,
	},
];
