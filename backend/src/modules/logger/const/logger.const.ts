import * as path from 'path';
import * as fs from 'fs';

export const logDir = path.join('./logs');

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

export const localTimestamp = () => {
	const date = new Date();
	return date.toLocaleString();
};
