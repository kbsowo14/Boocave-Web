import React, { useEffect, useRef } from 'react'

type Message = {
	role: 'user' | 'assistant'
	content: string
}

type ChatMessagesProps = {
	messages: Message[]
	loading?: boolean
}

/**
 * @description
 * 나와 AI의 토론 메시지 목록
 */
export default function ChatMessages({ messages, loading = false }: ChatMessagesProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const [isTyping, setIsTyping] = React.useState(false)

	// 새 메시지가 추가되면 스크롤을 아래로
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	// 마지막 메시지가 AI이고 내용이 변경되면 타이핑 중으로 간주
	useEffect(() => {
		const lastMessage = messages[messages.length - 1]
		if (lastMessage && lastMessage.role === 'assistant') {
			setIsTyping(true)
			const timer = setTimeout(() => setIsTyping(false), 500)
			return () => clearTimeout(timer)
		}
	}, [messages])

	if (messages.length === 0) {
		return (
			<div className="w-full flex flex-col items-center justify-center py-20">
				<p className="text-gray-400 text-sm">책에 대한 생각을 자유롭게 나눠보세요!</p>
			</div>
		)
	}

	return (
		<div className="w-full flex flex-col items-start justify-start px-4 pt-4 pb-24 space-y-4">
			{messages?.map((message, index) => {
				const isLastMessage = index === messages.length - 1
				const showCursor = isLastMessage && message.role === 'assistant' && isTyping

				return (
					<div
						key={index}
						className={`w-full flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						<div
							className={`max-w-[80%] rounded-2xl px-4 py-3 ${
								message.role === 'user'
									? 'bg-[#51CD42] text-white'
									: 'bg-gray-700 text-white border border-gray-600'
							}`}
						>
							<p className="text-sm whitespace-pre-wrap break-words">
								{message.content}
								{showCursor && (
									<span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse"></span>
								)}
							</p>
						</div>
					</div>
				)
			})}

			{/* Loading indicator */}
			{loading && (
				<div className="w-full flex justify-start">
					<div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-700 text-white border border-gray-600">
						<div className="flex space-x-2">
							<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
							<div
								className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
								style={{ animationDelay: '0.1s' }}
							></div>
							<div
								className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
								style={{ animationDelay: '0.2s' }}
							></div>
						</div>
					</div>
				</div>
			)}

			<div ref={messagesEndRef} />
		</div>
	)
}
