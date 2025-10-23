'use client'

import ChatBookInfo from '@/components/ChatBookInfo'
import ChatInput from '@/components/ChatInput'
import ChatMessages from '@/components/ChatMessages'
import axios from 'axios'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, Suspense } from 'react'
import { MdSaveAlt } from 'react-icons/md'

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

function ChatContent() {
	const searchParams = useSearchParams()
	const bookGoogleId = searchParams?.get('bookGoogleId') || ''
	const queryParam = searchParams?.get('query') || ''
	const router = useRouter()

	const [currentBookInfo, setCurrentBookInfo] = useState<Book | null>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [loading, setLoading] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [showBookTitleModal, setShowBookTitleModal] = useState(false)
	const [bookTitle, setBookTitle] = useState('')

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

	const handleEndDiscussion = async () => {
		if (messages.length === 0) {
			alert('토론 내용이 없습니다')
			return
		}

		// 책 정보가 없으면 제목 입력 모달 표시
		if (!currentBookInfo) {
			setShowBookTitleModal(true)
			return
		}

		if (!confirm('토론을 종료하고 리뷰로 저장하시겠습니까?')) {
			return
		}

		await saveReview(currentBookInfo)
	}

	const saveReview = async (bookInfo: Book) => {
		setIsSaving(true)

		try {
			// 1. 대화 내용 요약 및 별점 분석
			const summaryResponse = await axios.post('/api/chat/summarize', {
				messages,
				bookInfo,
			})

			const { rating, review } = summaryResponse.data

			// 2. AI가 분석한 별점과 요약된 리뷰 저장
			await axios.post('/api/reviews', {
				bookData: bookInfo,
				rating, // AI가 대화 내용을 분석하여 결정한 별점
				review,
			})

			alert(`토론 내용이 리뷰로 저장되었습니다! (별점: ${rating}점)`)
			router.push('/my-library')
		} catch (error) {
			console.error('리뷰 저장 오류:', error)
			alert('리뷰 저장에 실패했습니다')
		} finally {
			setIsSaving(false)
		}
	}

	const handleBookTitleSubmit = async (bookTitle: string) => {
		if (!bookTitle.trim()) {
			alert('책 제목을 입력해주세요')
			return
		}

		// 임시 책 정보 생성
		const tempBookInfo: Book = {
			googleId: `temp_${Date.now()}`, // 임시 ID
			title: bookTitle.trim(),
			author: '작자 미상',
			publisher: '',
			publishedDate: '',
			description: '',
			thumbnail: '',
			isbn: '',
		}

		setShowBookTitleModal(false)
		await saveReview(tempBookInfo)
	}

	useEffect(() => {
		if (bookGoogleId) {
			searchBookInfo(bookGoogleId)
		} else if (queryParam) {
			// query 파라미터가 있으면 책 정보 없이 토론 시작
			// AI에게 책에 대한 정보를 요청하는 첫 메시지 전송
			const initialMessage = {
				role: 'assistant' as const,
				content: `안녕하세요! "${queryParam}"에 대해 이야기해 볼까요?`,
			}
			setMessages([initialMessage])
		}
	}, [bookGoogleId, queryParam])

	return (
		<div className="w-full relative">
			{/* 저장 중 전체 화면 로딩 */}
			{isSaving && (
				<div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-50">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
					<p className="text-white text-base mt-4">리뷰 저장 중...</p>
				</div>
			)}

			{/* Book Info Area */}
			<ChatBookInfo data={currentBookInfo} />

			{/* Messages Area */}
			<ChatMessages messages={messages} loading={loading} />

			{/* Input Area */}
			<div className="w-full fixed bottom-0 flex flex-col justify-center items-center p-4">
				{/* 토론 종료 버튼 */}
				{messages.length > 1 && !loading && (
					<div className="w-full flex justify-center pb-4">
						<button
							onClick={handleEndDiscussion}
							disabled={isSaving}
							className="bg-[#35a828] text-white px-4 py-2 gap-2 rounded-full font-bold text-sm transition-colors flex flex-row justify-center items-center"
						>
							대화를 종료하고 리뷰 저장하기 <MdSaveAlt size={16} />
						</button>
					</div>
				)}
				<ChatInput onSend={sendMessage} disabled={loading || isSaving} />
			</div>

			{/* 책 제목 입력 모달 */}
			{showBookTitleModal && (
				<div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
					<div className="bg-[#222222] rounded-lg p-6 w-80">
						<h3 className="text-white text-lg font-bold mb-4">책 제목을 입력해주세요</h3>
						<input
							type="text"
							value={bookTitle}
							onChange={e => setBookTitle(e.target.value)}
							placeholder="예: 백화점"
							className="w-full px-4 py-3 text-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#51CD42] bg-[#333333] mb-4"
							onKeyPress={e => {
								if (e.key === 'Enter') {
									handleBookTitleSubmit(bookTitle)
								}
							}}
						/>
						<div className="flex gap-2">
							<button
								onClick={() => setShowBookTitleModal(false)}
								className="flex-1 px-4 py-2 text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-700"
							>
								취소
							</button>
							<button
								onClick={() => handleBookTitleSubmit(bookTitle)}
								className="flex-1 px-4 py-2 bg-[#51CD42] text-white rounded-lg hover:bg-[#45b838]"
							>
								저장
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default function Chat() {
	return (
		<Suspense
			fallback={
				<div className="w-full flex justify-center items-center min-h-screen">
					<p className="text-white">로딩 중...</p>
				</div>
			}
		>
			<ChatContent />
		</Suspense>
	)
}
