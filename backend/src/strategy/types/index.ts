import { Role } from '../../common/enums';

export interface UserPayload {
	id: number;
	username: string;
	email: string;
	role: Role;
	createdAt: string;
	updatedAt: string;
}

export interface JwtPayload extends Request{
	user: UserPayload;
}
