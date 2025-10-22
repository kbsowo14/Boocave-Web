'use client'

import { BookSearchForm } from '@/components/BookSearchForm'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { ReviewModal } from '@/components/ReviewModal'
import { BookCard } from '@/components/BookCard'
import { MdDoNotDisturbAlt } from 'react-icons/md'
import { LoadingIndicator } from '@/components/LoadingIndicator'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

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

export default function Search() {
	const searchParams = useSearchParams()
	const queryParam = searchParams?.get('query') || ''
	const router = useRouter()

	const [books, setBooks] = useState<Book[]>([])
	const [loading, setLoading] = useState(false)

	const isPending = useRef(false)

	const handleSearch = async (query: string) => {
		if (isPending.current) return
		isPending.current = true

		setLoading(true)

		try {
			const response = await axios.get(`/api/books/search?q=${encodeURIComponent(query)}`)
			setBooks(response.data.books)
		} catch (error) {
			console.error('검색 오류:', error)
			alert('도서 검색에 실패했습니다')
		} finally {
			setLoading(false)
			isPending.current = false
		}
	}

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
