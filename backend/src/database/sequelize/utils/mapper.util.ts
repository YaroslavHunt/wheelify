import { ClassConstructor, plainToInstance } from 'class-transformer'

/**
 * A function to convert an object into a DTO model, automatically discarding unnecessary fields.
 * @param cls - class DTO
 * @param plain - object (entity)
 * @returns Object in the desired format
 */
export function toDTO<T, V>(cls: ClassConstructor<T>, plain: V): T {
	return plainToInstance(cls, plain, { excludeExtraneousValues: true })
}
