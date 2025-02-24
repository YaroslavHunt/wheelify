import { Button } from '@/shared/components/ui'

export function AuthSocial() {
	return (
		<>
			<div className='grid grid-cols-2'>
				<Button
					variant="outline"
					className="w-full flex items-center justify-center gap-2"
				>
					<img
						width="20"
						height="20"
						src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
						alt="Google Logo"
						className="h-5 w-5"
					/>
					<span className="text-lg font-medium">Continue with Google</span>
				</Button>
			</div>
		</>
	)
}
