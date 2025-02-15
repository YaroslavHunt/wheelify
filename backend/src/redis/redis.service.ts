import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import IORedis, { Redis } from 'ioredis'
import { RedisEnv, SessionEnv } from '@/config/enums'
import { WinstonLoggerService } from '@/logger/logger.service'
import * as session from 'express-session'
import { RedisStore } from 'connect-redis'
import { ms, StringValue } from '@/libs/common/utils/ms.utils'

@Injectable()
export class RedisConfigService {
	private readonly client: Redis;
	private readonly sessionStore: RedisStore;

	constructor(
		private readonly config: ConfigService,
		private readonly logger: WinstonLoggerService
	) {
		const redis = this.config.getOrThrow<string>(RedisEnv.URI);

		this.client = new IORedis(redis, {
			maxRetriesPerRequest: 5,
		});

		this.client.on('connect', () => this.logger.log('Connected to Redis'));
		this.client.on('error', (e) => this.logger.error(`Redis error: ${e.message}`));

		this.sessionStore = new RedisStore({
			client: this.client,
			prefix: this.config.getOrThrow<string>(SessionEnv.FOLDER)
		});
	}

	getClient(): Redis {
		return this.client;
	}

	getSessionStore(): RedisStore {
		return this.sessionStore;
	}

	getSessionConfig(): session.SessionOptions {
		return {
			secret: this.config.getOrThrow<string>(SessionEnv.SECRET),
			name: this.config.getOrThrow<string>(SessionEnv.NAME),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: this.config.getOrThrow<string>(SessionEnv.DOMAIN),
				maxAge: ms(this.config.getOrThrow<StringValue>(SessionEnv.MAX_AGE)),
				httpOnly: this.config.getOrThrow<boolean>(SessionEnv.IS_HTTP_ONLY),
				secure: this.config.getOrThrow<boolean>(SessionEnv.SECURE),
				sameSite: 'lax'
			},
			store: this.getSessionStore()
		};
	}
}
