export interface LogError extends Error {
	details?: {
		method: string,
		url: string,
		hostname: string,
		status: number,
	};
}
