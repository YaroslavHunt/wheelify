import { Role } from '../../common/enums';

export interface UserPayload {
	id: string;
	username: string;
	email: string;
	role: Role;
	createdAt: Date;
	updatedAt: Date;
}

export interface JwtPayload extends Request{
	user: UserPayload;
}
