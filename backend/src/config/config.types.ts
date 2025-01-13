export interface AppConfig {
	nodeEnv: 'development' | 'production';
	port: number;
}

export interface DatabaseConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
}

export interface JwtConfig {
	secret: string;
	expire: string;
}
