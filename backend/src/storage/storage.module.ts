import { StorageService } from '@/storage/storage.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [StorageService],
	exports: [StorageService]
})
export class StorageModule {}