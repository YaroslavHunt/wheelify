import { Module } from '@nestjs/common'

import { StorageService } from '@/libs/storage/storage.service'

@Module({
	providers: [StorageService],
	exports: [StorageService]
})
export class StorageModule {}
