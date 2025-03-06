import { ClassConstructor, plainToInstance } from 'class-transformer'

/**
 * A function to convert an object into a DTO models, automatically discarding unnecessary fields.
 * @param cls - class DTO
 * @param plain - object (entity)
 * @returns Object in the desired format
 */
export async function toDTO<T, V>(
	cls: ClassConstructor<T>,
	plain: V
): Promise<T> {
	return plainToInstance(cls, plain, { excludeExtraneousValues: true })
}
