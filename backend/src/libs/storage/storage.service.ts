import { GetObjectCommand, S3 } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorageService {
	private readonly s3: S3
	private readonly bucket: string
	private readonly region: string

	constructor(private readonly config: ConfigService) {
		this.region = this.config.getOrThrow<string>('AWS_REGION')
		this.bucket = this.config.getOrThrow<string>('AWS_BUCKET_NAME')
		this.s3 = new S3({
			region: this.region,
			credentials: {
				accessKeyId:
					this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
				secretAccessKey: this.config.getOrThrow<string>(
					'AWS_SECRET_ACCESS_KEY'
				)
			}
		})
	}

	async getFileUrl(fileName: string): Promise<string | null> {
		if (this.isPublicBucket()) {
			return (
				`https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileName}` ||
				null
			)
		}

		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: fileName
		})

		return (
			(await getSignedUrl(this.s3, command, { expiresIn: 3600 })) || null
		)
	}

	private isPublicBucket(): boolean {
		return this.config.get<boolean>('AWS_BUCKET_PUBLIC') ?? false
	}
}
