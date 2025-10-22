'use client'

import React, { useState } from 'react'
import { FaCircleArrowUp } from 'react-icons/fa6'

export default function ChatInput() {
	const [message, setMessage] = useState('')

	const handleSendMessage = () => {
		console.log('🚀', message)
	}

	return (
		<div className="flex gap-2 relative w-full mx-auto">
			<input
				type="text"
				value={message}
				onChange={e => setMessage(e.target.value)}
				placeholder="토론을 시작해보세요"
				className="flex-1 px-4 py-3 text-white border border-gray-300 rounded-full focus:outline-none focus:border-[#51CD42] focus:shadow-[0_0_10px_0_rgba(81,205,66,0.5)] w-full"
			/>
			<button onClick={handleSendMessage} className="absolute right-4 top-1/2 -translate-y-1/2">
				<FaCircleArrowUp size={24} color="#fff" />
			</button>
		</div>
	)
}
