'use client'

import Image from 'next/image'
import React, { useCallback } from 'react'
import { signIn } from 'next-auth/react'

/**
 * @description
 * 로그인 페이지
 */
export default function Login() {
	/**
	 * @description
	 * Google 로그인 함수
	 */
	const googleLogin = useCallback(() => {
		signIn('google')
	}, [])

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
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
						className="flex flex-row justify-center items-center border-[1px] border-white rounded-md py-2 px-6"
					>
						<Image
							src="/google_login_icon.webp"
							alt="google_login_icon"
							width={16}
							height={16}
						/>
						<p className="text-white text-base ml-4">Google로 계속하기</p>
					</button>
				</div>
			</div>
		</div>
	)
}
