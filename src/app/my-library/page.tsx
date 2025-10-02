'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

type BookReview = {
	id: string
	rating: number
	review: string
	createdAt: string
	book: {
		id: string
		title: string
		author: string
		thumbnail: string
		publisher: string
		publishedDate: string
	}
}

export default function MyLibrary() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [reviews, setReviews] = useState<BookReview[]>([])
	const [loading, setLoading] = useState(true)
	const [editingReview, setEditingReview] = useState<BookReview | null>(null)

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/')
		}
	}, [status, router])

	useEffect(() => {
		if (session) {
			fetchReviews()
		}
	}, [session])

	const fetchReviews = async () => {
		try {
			const response = await axios.get('/api/reviews')
			setReviews(response.data.reviews)
		} catch (error) {
			console.error('리뷰 조회 오류:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (reviewId: string) => {
		if (!confirm('정말 삭제하시겠습니까?')) return

		try {
			await axios.delete(`/api/reviews/${reviewId}`)
			setReviews(reviews.filter(r => r.id !== reviewId))
			alert('삭제되었습니다')
		} catch (error) {
			console.error('삭제 오류:', error)
			alert('삭제에 실패했습니다')
		}
	}

	if (status === 'loading' || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
			</div>
		)
	}

	if (!session) {
		return null
	}

	return (
		<main className="min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">내 책장</h1>
					<p className="text-gray-600">
						총 <span className="font-semibold text-blue-600">{reviews.length}권</span>의 책을
						읽었습니다
					</p>
				</div>

				{reviews.length === 0 ? (
					<div className="text-center py-20">
						<div className="text-6xl mb-4">📚</div>
						<h2 className="text-2xl font-semibold text-gray-900 mb-2">
							아직 등록된 책이 없습니다
						</h2>
						<p className="text-gray-600 mb-6">첫 번째 책을 검색하고 독후감을 작성해보세요!</p>
						<button
							onClick={() => router.push('/')}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							책 검색하기
						</button>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{reviews.map(review => (
							<div
								key={review.id}
								className="bg-[#333333] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
							>
								{/* 책 표지 */}
								<div className="h-64 bg-[#444444] flex items-center justify-center">
									{review?.book?.thumbnail ? (
										<Image
											src={review.book.thumbnail}
											alt={review.book.title}
											className="object-contain rounded-r-lg rounded-l-sm border-[2px] border-gray-200 shadow-md shadow-[#171717]"
											width={100}
											height={200}
										/>
									) : (
										<div className="text-6xl">📖</div>
									)}
								</div>

								{/* 책 정보 */}
								<div className="p-6">
									<h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
										{review.book.title}
									</h3>
									<p className="text-sm text-gray-600 mb-3">{review.book.author}</p>

									{/* 별점 */}
									<div className="flex items-center mb-4">
										{[1, 2, 3, 4, 5].map(star => (
											<span key={star} className="text-xl">
												{star <= review.rating ? '⭐' : '☆'}
											</span>
										))}
									</div>

									{/* 독후감 미리보기 */}
									<p className="text-sm text-gray-700 mb-4 line-clamp-3">{review.review}</p>

									{/* 날짜 */}
									<p className="text-xs text-gray-500 mb-4">
										{new Date(review.createdAt).toLocaleDateString('ko-KR')}
									</p>

									{/* 버튼 */}
									<div className="flex gap-2">
										<button
											onClick={() => setEditingReview(review)}
											className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
										>
											상세보기
										</button>
										<button
											onClick={() => handleDelete(review.id)}
											className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
										>
											삭제
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* 상세보기 모달 */}
			{editingReview && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							{/* 헤더 */}
							<div className="flex justify-between items-start mb-6">
								<h2 className="text-2xl font-bold text-gray-900">독후감</h2>
								<button
									onClick={() => setEditingReview(null)}
									className="text-gray-400 hover:text-gray-600"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							{/* 책 정보 */}
							<div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
								{editingReview.book.thumbnail ? (
									<img
										src={editingReview.book.thumbnail}
										alt={editingReview.book.title}
										className="w-24 h-32 object-cover rounded"
									/>
								) : (
									<div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center">
										<span className="text-4xl">📖</span>
									</div>
								)}
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-900 mb-1">
										{editingReview.book.title}
									</h3>
									<p className="text-sm text-gray-600">{editingReview.book.author}</p>
									<p className="text-xs text-gray-500 mt-1">
										{editingReview.book.publisher} ·{' '}
										{editingReview.book.publishedDate?.substring(0, 4)}
									</p>
									<div className="flex items-center mt-3">
										{[1, 2, 3, 4, 5].map(star => (
											<span key={star} className="text-2xl">
												{star <= editingReview.rating ? '⭐' : '☆'}
											</span>
										))}
									</div>
								</div>
							</div>

							{/* 독후감 */}
							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-700 mb-2">독후감</h4>
								<div className="p-4 bg-gray-50 rounded-lg">
									<p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
										{editingReview.review}
									</p>
								</div>
							</div>

							{/* 날짜 */}
							<p className="text-sm text-gray-500 mb-6">
								작성일:{' '}
								{new Date(editingReview.createdAt).toLocaleDateString('ko-KR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</p>

							<button
								onClick={() => setEditingReview(null)}
								className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								닫기
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	)
}
