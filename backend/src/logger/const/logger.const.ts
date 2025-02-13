import * as path from 'path'

export const logDir = path.join('./logs')

export const localTimestamp = () => {
	const date = new Date()
	return date.toLocaleString()
}
