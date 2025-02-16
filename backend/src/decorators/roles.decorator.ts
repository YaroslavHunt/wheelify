import { SetMetadata } from '@nestjs/common'
import { Role } from '@/libs/common/enums'

export const ROLES_KEY= 'roles'

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
