export enum AdminEnv {
	USERNAME = 'admin.username',
	EMAIL = 'admin.email',
	PASSWORD = 'admin.password',
}

export enum AppEnv {
	MODE = 'app.mode',
	PREFIX = 'app.prefix',
	HOST = 'app.host',
	PORT = 'app.port',
	URL = 'app.url',
	CLIENT = 'app.client',
}

export enum CorsEnv {
	DOMAINS = 'cors.domains',
	COOKIES_SECRET = 'cors.cookiesSecret',
}

export enum DatabaseEnv {
	DIALECT = 'database.dialect',
	HOST = 'database.host',
	PORT = 'database.port',
	USERNAME = 'database.username',
	PASSWORD = 'database.password',
	DATABASE = 'database.database',
	URI = 'database.uri',
}

export enum OAuthEnv {
	CLIENT_ID = 'oauth.client_id',
	CLIENT_SECRET = 'oauth.client_secret',
	RECAPTCHA_SECRET_KEY = 'oauth.recaptcha_secret_key',
}

export enum RedisEnv {
	HOST = 'redis.host',
	PORT = 'redis.port',
	USERNAME = 'redis.username',
	PASSWORD = 'redis.password',
	URI = 'redis.path',
}

export enum SessionEnv {
	SECRET = 'session.secret',
	NAME = 'session.name',
	DOMAIN = 'session.cookie.domain',
	MAX_AGE = 'session.cookie.maxAge',
	IS_HTTP_ONLY = 'session.cookie.httpOnly',
	SECURE = 'session.cookie.secure',
}

export enum StorageEnv {
	KEY = 'storage.key',
	SECRET = 'storage.secret',
	REGION = 'storage.region',
	BUCKET = 'storage.s3bucket',
	IS_PUBLIC_BUCKET = 'storage.isPublicBucket',
}
