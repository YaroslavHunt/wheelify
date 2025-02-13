import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { TokenService } from './token.service'

@Module({
	providers: [TokenService, JwtService],
	exports: [TokenService]
})
export class TokenModule {}
