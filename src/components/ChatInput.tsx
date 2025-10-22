'use client'

import React, { useState } from 'react'
import { FaCircleArrowUp } from 'react-icons/fa6'

type ChatInputProps = {
	onSend: (message: string) => void
	disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
	const [message, setMessage] = useState('')

	const handleSendMessage = () => {
		if (message.trim() && !disabled) {
			onSend(message)
			setMessage('')
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	return (
		<div className="flex gap-2 relative w-full mx-auto">
			<input
				type="text"
				value={message}
				onChange={e => setMessage(e.target.value)}
				onKeyPress={handleKeyPress}
				placeholder="토론을 시작해보세요"
				disabled={disabled}
				className="flex-1 px-4 py-3 text-white border border-gray-300 rounded-full focus:outline-none focus:border-[#51CD42] focus:shadow-[0_0_10px_0_rgba(81,205,66,0.5)] w-full disabled:opacity-50 disabled:cursor-not-allowed bg-[#171717]"
			/>
			<button
				onClick={handleSendMessage}
				disabled={disabled || !message.trim()}
				className="absolute right-4 top-1/2 -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<FaCircleArrowUp size={24} color="#fff" />
			</button>
		</div>
	)
}
