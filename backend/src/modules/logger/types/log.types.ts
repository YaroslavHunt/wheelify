export interface LogError {
	method: string,
	url: string,
	hostname: string,
	statusCode: number,
	errorType: string,
	message: string | string[] | object,
	stack?: string,
}
