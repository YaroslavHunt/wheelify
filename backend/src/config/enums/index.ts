export enum AdminEnv {
	USERNAME = 'admin.username',
	PASSWORD = 'admin.password',
	EMAIL = 'admin.email',
}

export enum AppEnv {
	MODE = 'app.mode',
	PORT = 'app.port',
	URL = 'app.url',
}

export enum AwsEnv {
	KEY = 'aws.key',
	SECRET = 'aws.secret',
	REGION = 'aws.region',
	BUCKET = 'aws.s3bucket',
	IS_PUBLIC_BUCKET = 'aws.isPublicBucket',
}

export enum JwtEnv {
	SECRET = 'jwt.secret',
	ACCESS_EXP = 'jwt.accessExpire',
	REFRESH_EXP = 'jwt.refreshExpire',
}

export enum RedisEnv {
	HOST = 'redis.host',
	PORT = 'redis.port',
	USERNAME = 'redis.username',
	PASSWORD = 'redis.password',
	URI = 'redis.uri',
}

export enum SecurityEnv {
	DOMAINS = 'security.domains',
	COOKIES_SECRET = 'security.cookiesSecret',
}

export enum SequelizeEnv {
	DIALECT = 'sequelize.dialect',
	HOST = 'sequelize.host',
	PORT = 'sequelize.port',
	USERNAME = 'sequelize.username',
	PASSWORD = 'sequelize.password',
	DATABASE = 'sequelize.database',
	URI = 'sequelize.uri',
}

export enum SessionEnv {
	SECRET = 'session.secret',
	NAME = 'session.name',
	DOMAIN = 'session.domain',
	MAX_AGE = 'session.maxAge',
	IS_HTTP_ONLY = 'session.httpOnly',
	SECURE = 'session.secure',
	FOLDER = 'session.folder',
}
