import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const obj = args.object as RegisterUserReqDTO
		return obj.password === passwordRepeat
	}
}