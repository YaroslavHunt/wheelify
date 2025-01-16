export interface UserPayload {
	id: number;
	username: string;
	email: string;
	role: string;
	createdAt: string;
	updatedAt: string;
}

export interface JwtPayload extends Request{
	user: UserPayload;
}
