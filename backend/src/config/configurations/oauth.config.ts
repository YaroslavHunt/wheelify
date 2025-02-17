import { OAuthConfig } from '@/config/types'

export default (): OAuthConfig => ({
	client_id: <string> process.env.GOOGLE_CLIENT_ID,
	client_secret: <string> process.env.GOOGLE_CLIENT_SECRET,
 	recaptcha_secret_key: <string> process.env.GOOGLE_RECAPTCHA_SECRET_KEY
})
