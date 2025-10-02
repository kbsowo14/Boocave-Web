'use client'

import { BookSearchForm } from '@/components/BookSearchForm'
import axios from 'axios'
import { useState } from 'react'
import { ReviewModal } from '@/components/ReviewModal'
import { BookCard } from '@/components/BookCard'
import { MdDoNotDisturbAlt } from 'react-icons/md'
import { LoadingIndicator } from '@/components/LoadingIndicator'

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
	const [books, setBooks] = useState<Book[]>([])
	const [loading, setLoading] = useState(false)
	const [selectedBook, setSelectedBook] = useState<Book | null>(null)
	const [searched, setSearched] = useState(false)

	const handleSearch = async (query: string) => {
		setLoading(true)
		setSearched(true)

		try {
			const response = await axios.get(`/api/books/search?q=${encodeURIComponent(query)}`)
			setBooks(response.data.books)
		} catch (error) {
			console.error('검색 오류:', error)
			alert('도서 검색에 실패했습니다')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className="px-4 py-8">
				<div className="text-center">
					<p className="text-base text-left font-bold text-white">책을 찾고</p>
					<p className="text-base text-left text-white mb-4">내 생각을 기록해보세요!</p>
					<BookSearchForm onSearch={handleSearch} loading={loading} />
				</div>

				{/* Loading Indicator */}
				{loading && (
					<div className="text-center py-20">
						<LoadingIndicator />
					</div>
				)}

				{/* No Search Results */}
				{!loading && searched && books?.length === 0 && (
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
									onSelect={setSelectedBook as (book: unknown) => void}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* 리뷰 작성 모달 */}
			{selectedBook && (
				<ReviewModal
					book={selectedBook}
					onClose={() => setSelectedBook(null)}
					onSuccess={() => setBooks([])}
				/>
			)}
		</>
	)
}
