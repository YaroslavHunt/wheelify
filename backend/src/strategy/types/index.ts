import { Role } from '../../libs/common/enums'

export interface JwtPayload {
	id: string
	username: string
	email: string
	role: Role
	isActive: boolean
}

export interface AuthRequest extends Request {
	user: JwtPayload
}
