export interface LogError {
	message: string;
	name?: string;
	stack?: string;
	details?: {
		method: string;
		url: string;
		hostname: string;
		status: number;
	};
}
