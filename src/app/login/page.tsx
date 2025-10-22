'use client'

import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { signIn } from 'next-auth/react'

/**
 * @description
 * 로그인 페이지
 */
export default function Login() {
	const [isLoading, setIsLoading] = useState(false)

	/**
	 * @description
	 * Google 로그인 함수
	 */
	const googleLogin = useCallback(async () => {
		try {
			setIsLoading(true)
			// signIn은 자체적으로 리다이렉트를 처리하므로 callbackUrl 옵션 사용
			await signIn('google', {
				callbackUrl: '/', // 로그인 성공 후 이동할 페이지
			})
		} catch (error) {
			console.error('googleLogin error :', error)
			setIsLoading(false)
		}
	}, [])

	return (
		<div className="w-full flex flex-col justify-center items-center">
			{/* LOGO */}
			<div className="text-lg font-bold flex flex-row justify-start items-center relative">
				<div className="text-[#51CD42] text-2xl">BOO</div>
				<div className="text-white text-2xl">CAVE</div>
			</div>

			{/* Login Box */}
			<div className="w-full flex justify-center items-center mt-8">
				<div className="bg-[#222222] rounded-lg p-6 flex flex-col justify-center items-center gap-4">
					<button
						onClick={googleLogin}
						disabled={isLoading}
						className="flex flex-row justify-center items-center border-[1px] border-white rounded-md py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
					>
						{isLoading ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<p className="text-white text-base ml-4">로그인 중...</p>
							</>
						) : (
							<>
								<Image
									src="/google_login_icon.webp"
									alt="google_login_icon"
									width={16}
									height={16}
								/>
								<p className="text-white text-base ml-4">Google로 계속하기</p>
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	)
}
