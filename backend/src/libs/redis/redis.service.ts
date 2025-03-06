import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisStore } from 'connect-redis'
import * as session from 'express-session'
import IORedis, { Redis } from 'ioredis'

import { ms, StringValue } from '@/common/utils/ms'

@Injectable()
export class RedisConfigService {
	private readonly client: Redis
	private readonly sessionStore: RedisStore
	private readonly logger = new Logger(RedisConfigService.name)

	constructor(private readonly config: ConfigService) {
		const redisUrl = `redis://${this.config.getOrThrow<string>('REDIS_USER')}:${this.config.getOrThrow<string>('REDIS_PASSWORD')}@${this.config.getOrThrow<string>('REDIS_HOST')}:${this.config.getOrThrow<number>('REDIS_PORT')}`

		this.client = new IORedis(redisUrl, {
			maxRetriesPerRequest: 5
		})

		this.client.on('connect', () => this.logger.log('Connected to Redis'))
		this.client.on('error', e =>
			this.logger.error(`Unable connect to Redis: ${e.message}`)
		)

		this.sessionStore = new RedisStore({
			client: this.client,
			prefix: 'sessions:'
		})
	}

	getClient(): Redis {
		return this.client
	}

	getSessionStore(): RedisStore {
		return this.sessionStore
	}

	getSessionConfig(): session.SessionOptions {
		const maxAge = this.config.getOrThrow<StringValue>('SESSION_MAX_AGE')
		return {
			secret: this.config.getOrThrow<string>('SESSION_SECRET'),
			name: this.config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: this.config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(maxAge),
				httpOnly: this.config.getOrThrow<boolean>('SESSION_HTTP_ONLY'),
				secure: false,
				sameSite: 'lax'
			},
			store: this.getSessionStore()
		}
	}
}
