import { Injectable } from '@nestjs/common';
import { AdsDto } from './dto/ads.dto';
import { CreateAdsResponse } from './response/create.ads.res';
import User from '../user/model/user.model';
import Ads from './model/ads.model';
import { WinstonLoggerService } from '../../logger/logger.service';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AdsService {
	constructor(
		@InjectModel(Ads) private readonly adsRepository: typeof Ads,
		private readonly logger: WinstonLoggerService,
	) {
		this.logger.setLabel(AdsService.name)
	}

	// async createAds(user: User, dto: AdsDto): Promise<CreateAdsResponse> {
	// 	try {
	// 		const advertisement: CreateAdsResponse = {
	// 			user: user.id,
	// 			title: dto.title,
	// 			description: dto.description,
	// 		};
	// 		await this.adsRepository.create(advertisement);
	// 		return advertisement;
	// 	} catch (e) {
	// 		throw new Error(e);
	// 	}
	// }
	//
	// async updateAds(
	// 	userId: string,
	// 	adsId: string,
	// 	dto: AdsDto,
	// ): Promise<AdsDto> {
	// 	try {
	// 		await this.adsRepository.update(dto, {
	// 			where: { user: userId, id: adsId },
	// 		});
	// 		return dto;
	// 	} catch (e) {
	// 		throw new Error(e);
	// 	}
	// }
	//
	// async deleteAds(userId: number, adsId: number): Promise<boolean> {
	// 	try {
	// 		await this.adsRepository.destroy({ where: { user: userId, id: adsId } });
	// 		return true;
	// 	} catch (e) {
	// 		throw new Error(e);
	// 	}
	// }
}
