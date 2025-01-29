export interface LogError extends Error {
	message: string;
	details?: {
		method: string,
		url: string,
		hostname: string,
		status: number,
	};
}
