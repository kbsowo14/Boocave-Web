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
			const response = await axios.post('/api/chat', {
				messages: [...messages, userMessage],
				bookInfo: currentBookInfo,
			})

			// AI 응답 추가
			const aiMessage: Message = response.data.message
			setMessages(prev => [...prev, aiMessage])
		} catch (error) {
			console.error('메시지 전송 오류:', error)
			alert('메시지 전송에 실패했습니다')
		} finally {
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
			<div className="w-full fixed bottom-0 flex justify-center items-center p-4">
				<ChatInput onSend={sendMessage} disabled={loading} />
			</div>
		</div>
	)
}
