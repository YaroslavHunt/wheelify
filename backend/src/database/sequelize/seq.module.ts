import { Global, Module } from '@nestjs/common';
import { TransactionHelper } from './transaction.helper';

@Global()
@Module({
	providers: [TransactionHelper],
	exports: [TransactionHelper],
})
export class SeqModule {}
