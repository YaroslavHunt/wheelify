import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { WinstonLoggerService } from '@/logger/logger.service'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class StorageService {
	private readonly s3: S3
	private readonly bucket: string
	private readonly region: string

	constructor(
		private readonly config: ConfigService,
		private readonly logger: WinstonLoggerService
	) {
		this.logger.setLabel(StorageService.name)
		this.region = this.config.get('aws.region')
		this.bucket = this.config.get('aws.bucket')
		this.s3 = new S3({
			region: this.region,
			credentials: {
				accessKeyId: this.config.get('aws.key'),
				secretAccessKey: this.config.get('aws.secret')
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
	}

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
	}

	async getFileUrl(fileName: string): Promise<string> {
		try {
			if (this.isPublicBucket()) {
				return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileName}`;
			}

			const command = new GetObjectCommand({
				Bucket: this.bucket,
				Key: fileName,
			});

			return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
		} catch (e) {
			this.logger.error('Failed to generate file URL', e);
			throw new InternalServerErrorException('Failed to generate file URL');
		}
	}

	private isPublicBucket(): boolean {
		return this.config.get<boolean>('aws.publicBucket') ?? false;
	}


}