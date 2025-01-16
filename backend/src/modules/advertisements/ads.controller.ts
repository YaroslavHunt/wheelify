import { Body, Controller, Delete, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdsService } from './ads.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAdsResponse } from './response/create.ads.res';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { AdsDto } from './dto/ads.dto';
import { JwtPayload } from '../../strategy/types';
import User from '../user/model/user.model';

@ApiTags('Advertisements')
@Controller('advertisements')
export class AdsController {
	constructor(private readonly adsService: AdsService) {
	}

	@ApiResponse({ status: 201, type: CreateAdsResponse })
	@UseGuards(JwtAuthGuard)
	@Post('create-ad')
	createAds(@Body() dto: AdsDto, @Req() request: JwtPayload): Promise<CreateAdsResponse> {
		const user = request.user as User;
		return this.adsService.createAds(user, dto);
	}

	@ApiResponse({ status: 202, type: AdsDto })
	@UseGuards(JwtAuthGuard)
	@Patch('update-ads')
	updateAds(
		@Body() dto: AdsDto,
		@Query('id') adsId: number,
		@Req() request: JwtPayload,
	): Promise<AdsDto> {
		const { id } = request.user;
		return this.adsService.updateAds(id, adsId, dto);
	}

	@ApiResponse({ status: 200 })
	@UseGuards(JwtAuthGuard)
	@Delete('delete-ads')
	deleteAds(
		@Query('id') adsId: number,
		@Req() request: JwtPayload): Promise<boolean> {
		const { id } = request.user;
		return this.adsService.deleteAds(id, adsId);
	}
}
