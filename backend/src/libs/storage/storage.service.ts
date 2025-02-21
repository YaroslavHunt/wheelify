import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { WinstonLoggerService } from '@/libs/logger/logger.service'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { StorageEnv } from '@/config/enums'

@Injectable()
export class StorageService {
	private readonly s3: S3
	private readonly bucket: string
	private readonly region: string

	constructor(
		private readonly config: ConfigService,
		private readonly logger: WinstonLoggerService
	) {
		this.region = this.config.get(StorageEnv.REGION)
		this.bucket = this.config.get(StorageEnv.BUCKET)
		this.s3 = new S3({
			region: this.region,
			credentials: {
				accessKeyId: this.config.get(StorageEnv.KEY),
				secretAccessKey: this.config.get(StorageEnv.SECRET)
			}
		})

	}

	async uploadFile(fileName: string, fileBuffer: Buffer) {
		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: fileName,
			Body: fileBuffer
		})
		try {
			await this.s3.send(command)
			return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileName}`;
		} catch (e) {
			this.logger.error('Upload file failed', e)
			throw new InternalServerErrorException('Upload file failed')
		}
	} //TODO

	async loadFile(fileName: string) {
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: fileName,
		});

		try {
			const { Body } = await this.s3.send(command);
			const chunks: Uint8Array[] = [];
			for await (const chunk of Body as AsyncIterable<Uint8Array>) {
				chunks.push(chunk);
			}
			return Buffer.concat(chunks);
		} catch (e) {
			this.logger.error('Upload file failed', e);
			throw new InternalServerErrorException('Load file failed');
		}
	} //TODO

	async getFileUrl(fileName: string): Promise<string | null> {
		try {
			if (this.isPublicBucket()) {
				return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileName}` || null;
			}

			const command = new GetObjectCommand({
				Bucket: this.bucket,
				Key: fileName,
			});

			return await getSignedUrl(this.s3, command, { expiresIn: 3600 }) || null;
		} catch (e) {
			this.logger.error('Failed to generate file URL', e);
			throw new InternalServerErrorException('Failed to generate file URL');
		}
	}

	private isPublicBucket(): boolean {
		return this.config.get<boolean>(StorageEnv.IS_PUBLIC_BUCKET) ?? false;
	}


}