'use client'

import ChatBookInfo from '@/components/ChatBookInfo'
import ChatInput from '@/components/ChatInput'
import ChatMessages from '@/components/ChatMessages'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Book = {
	googleId: string
	title: string
	author: string
	publisher: string
	publishedDate: string
	description: string
	thumbnail: string
	isbn: string
}

type Message = {
	role: 'user' | 'assistant'
	content: string
}

export default function Chat() {
	const searchParams = useSearchParams()
	const bookGoogleId = searchParams?.get('bookGoogleId') || ''

	const [currentBookInfo, setCurrentBookInfo] = useState<Book | null>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [loading, setLoading] = useState(false)

	const searchBookInfo = async (bookGoogleId: string) => {
		try {
			const response = await axios.get(`/api/books/${bookGoogleId}`)
			setCurrentBookInfo(response.data.book)
		} catch (error) {
			console.warn('searchBookInfo error', error)
		}
	}

	const sendMessage = async (content: string) => {
		if (!content.trim() || loading) return

		// 사용자 메시지 추가
		const userMessage: Message = { role: 'user', content }
		setMessages(prev => [...prev, userMessage])
		setLoading(true)

		try {
			// 스트리밍 응답을 위한 fetch 사용
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					messages: [...messages, userMessage],
					bookInfo: currentBookInfo,
				}),
			})

			if (!response.ok) {
				throw new Error('AI 응답 생성에 실패했습니다')
			}

			const reader = response.body?.getReader()
			const decoder = new TextDecoder()

			if (!reader) {
				throw new Error('스트리밍 응답을 받을 수 없습니다')
			}

			// AI 메시지 초기화 (빈 메시지로 시작)
			const aiMessageIndex = messages.length + 1
			setMessages(prev => [...prev, { role: 'assistant', content: '' }])
			setLoading(false)

			let accumulatedContent = ''

			// 스트리밍 데이터 읽기
			while (true) {
				const { done, value } = await reader.read()
				if (done) break

				const chunk = decoder.decode(value)
				accumulatedContent += chunk

				// 메시지 업데이트 (타이핑 효과)
				setMessages(prev => {
					const newMessages = [...prev]
					newMessages[aiMessageIndex] = {
						role: 'assistant',
						content: accumulatedContent,
					}
					return newMessages
				})
			}
		} catch (error) {
			console.error('메시지 전송 오류:', error)
			alert('메시지 전송에 실패했습니다')
			setLoading(false)
		}
	}

	useEffect(() => {
		if (bookGoogleId) {
			searchBookInfo(bookGoogleId)
		}
	}, [bookGoogleId])

	return (
		<div className="w-full">
			{/* Book Info Area */}
			<ChatBookInfo data={currentBookInfo} />

			{/* Messages Area */}
			<ChatMessages messages={messages} loading={loading} />

			{/* Input Area */}
			<div className="w-full fixed bottom-0 flex justify-center items-center p-4 bg-[#171717]">
				<ChatInput onSend={sendMessage} disabled={loading} />
			</div>
		</div>
	)
}
