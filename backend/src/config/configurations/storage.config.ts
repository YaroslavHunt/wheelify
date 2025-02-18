import { StorageOptions } from '../types'
import * as process from 'node:process'
import { DEFAULT_REGION } from '@/libs/common/constants'

export default (): StorageOptions => ({
	key: <string>process.env.AWS_ACCESS_KEY_ID,
	secret: <string>process.env.AWS_SECRET_ACCESS_KEY,
	region: <string>process.env.AWS_REGION || DEFAULT_REGION,
	s3bucket: <string>process.env.AWS_BUCKET_NAME,
	isPublicBucket: <boolean>(process.env.AWS_BUCKET_PUBLIC === 'true')
})
