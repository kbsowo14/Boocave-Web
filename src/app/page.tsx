'use client'

import { useState } from 'react'
import { BookSearchForm } from '@/components/BookSearchForm'
import { BookCard } from '@/components/BookCard'
import { ReviewModal } from '@/components/ReviewModal'
import axios from 'axios'

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

export default function Home() {
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
		<main className="min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* 히어로 섹션 */}
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-gray-900 mb-4">나만의 책장</h1>
					<p className="text-xl text-gray-600 mb-8">
						읽은 책을 검색하고, 독후감을 작성해보세요
					</p>

					<BookSearchForm onSearch={handleSearch} loading={loading} />
				</div>

				{/* 검색 결과 */}
				{loading && (
					<div className="text-center py-12">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
						<p className="mt-4 text-gray-600">검색 중...</p>
					</div>
				)}

				{!loading && searched && books.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-600 text-lg">검색 결과가 없습니다</p>
					</div>
				)}

				{!loading && books.length > 0 && (
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							검색 결과 ({books.length}권)
						</h2>
						<div className="grid gap-4">
							{books.map(book => (
								<BookCard key={book.googleId} book={book} onSelect={setSelectedBook} />
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
		</main>
	)
}
