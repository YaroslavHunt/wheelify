export enum Role {
	ADMIN = 'admin',
	MODERATOR = 'moderator',
	USER = 'user'
}

export enum AuthMethod {
	CREDENTIAL = 'CREDENTIAL',
	GOOGLE = 'GOOGLE'
}


export enum Mode {
	DEV = 'development',
	PROD = 'production',
	TEST = 'test'
}

export enum TokenType {
	VERIFICATION = 'VERIFICATION',
	TWO_FACTOR = 'TWO_FACTOR',
	PASSWORD_RESET = 'PASSWORD_RESET'
}