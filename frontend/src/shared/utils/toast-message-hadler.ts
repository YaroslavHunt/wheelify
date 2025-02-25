import { toast } from "sonner"

export function toastMessageHandler(e: Error) {
	if(e.message) {
		const message = e.message
		const firstDotIndex = message.indexOf('.')

		if(firstDotIndex !== -1) {
			toast.error(message.slice(0, firstDotIndex), {
				description: message.slice(0, firstDotIndex + 1),
			})
		} else {
			toast.error(message)
		}
	} else {
		toast.error('Internal server error')
	}
}