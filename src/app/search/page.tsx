'use client'

import { BookSearchForm } from '@/components/BookSearchForm'
import axios from 'axios'
import { useEffect, useRef, useState, Suspense, useCallback } from 'react'
import { BookCard } from '@/components/BookCard'
import { MdDoNotDisturbAlt } from 'react-icons/md'
import { LoadingIndicator } from '@/components/LoadingIndicator'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useModalStore } from '@/stores/useModalStore'

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

function SearchContent() {
	const searchParams = useSearchParams()
	const queryParam = searchParams?.get('query') || ''
	const router = useRouter()
	const { open: openModal, close: closeModal } = useModalStore()

	const [books, setBooks] = useState<Book[]>([])
	const [loading, setLoading] = useState(false)

	const isPending = useRef(false)

	const alertModalContent = (
		<div className="flex flex-col justify-center items-center w-full">
			<p className="w-full text-white text-sm text-left font-bold mb-4">
				AI와 직접 토론을 시작합니다!
			</p>
			<button
				onClick={() => {
					closeModal()
					router.push(`/chat?query=${encodeURIComponent(queryParam)}`)
				}}
				className="w-full px-4 py-2 bg-[#51CD42] font-bold text-white rounded-lg hover:bg-[#45b838]"
			>
				확인
			</button>
		</div>
	)

	const handleSearch = useCallback(
		async (query: string) => {
			if (isPending.current) return
			isPending.current = true

			setLoading(true)

			try {
				const response = await axios.get(`/api/books/search?q=${encodeURIComponent(query)}`)
				setBooks(response.data.books)
			} catch (error: unknown) {
				console.error('검색 오류:', error)

				// API 제한 에러 (429) 또는 기타 에러 시 자동으로 채팅으로 이동
				if (error && typeof error === 'object' && 'response' in error) {
					const axiosError = error as { response?: { status?: number } }
					if (
						axiosError.response?.status === 429 ||
						(axiosError.response?.status && axiosError.response.status >= 500)
					) {
						openModal(alertModalContent, {
							title: '도서 검색 서비스가 일시적으로 제한되었어요!',
						})
					} else {
						openModal(alertModalContent, {
							title: '도서가 조회되지 않아요!',
						})
					}
				} else {
					openModal(alertModalContent, {
						title: '일시적인 오류로 검색이 실패했어요!',
					})
				}
			} finally {
				setLoading(false)
				isPending.current = false
			}
		},
		[openModal, alertModalContent]
	)

	useEffect(() => {
		if (queryParam) {
			handleSearch(queryParam)
		}
	}, [queryParam])

	return (
		<div className="w-full h-full">
			<div className="px-4 py-8">
				<div className="text-center">
					<p className="text-base text-left text-white">책을 선택하고</p>
					<p className="text-base text-left text-white mb-4 font-bold">
						<span className="text-green-500">토론</span>을 시작해주세요!
					</p>
					<BookSearchForm onSearch={handleSearch} loading={loading} />
				</div>

				{/* Loading Indicator */}
				{loading && (
					<div className="text-center py-20">
						<LoadingIndicator />
					</div>
				)}

				{/* No Search Results */}
				{!loading && books?.length === 0 && (
					<div className="text-center py-16 flex flex-col justify-center items-center">
						<p className="text-white text-sm">검색 결과가 없습니다</p>
						<MdDoNotDisturbAlt size={18} color="#fff" className="mt-4" />
					</div>
				)}

				{/* Search Results */}
				{!loading && books?.length > 0 && (
					<div className="pt-6">
						<p className="text-sm font-bold text-white mb-4">
							검색 결과 {books?.length || 0}권
						</p>
						<div className="grid gap-4">
							{books.map(book => (
								<BookCard
									key={book.googleId}
									book={book}
									// onSelect={setSelectedBook as (book: unknown) => void}
									onSelect={() => {
										router.push(`/chat?bookGoogleId=${book.googleId}`)
									}}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* 리뷰 작성 모달 */}
			{/* {selectedBook && (
				<ReviewModal
					book={selectedBook}
					onClose={() => setSelectedBook(null)}
					onSuccess={() => setBooks([])}
				/>
			)} */}
		</div>
	)
}

export default function Search() {
	return (
		<Suspense
			fallback={
				<div className="w-full flex justify-center items-center min-h-screen">
					<LoadingIndicator />
				</div>
			}
		>
			<SearchContent />
		</Suspense>
	)
}
