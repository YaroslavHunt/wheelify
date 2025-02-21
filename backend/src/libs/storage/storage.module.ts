import { StorageService } from '@/libs/storage/storage.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [StorageService],
	exports: [StorageService]
})
export class StorageModule {}