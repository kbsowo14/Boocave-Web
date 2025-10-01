'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import axios from 'axios'

type ReviewModalProps = {
	book: {
		googleId: string
		title: string
		author: string
		publisher: string
		publishedDate: string
		description: string
		thumbnail: string
		isbn: string
	} | null
	onClose: () => void
	onSuccess: () => void
}

export function ReviewModal({ book, onClose, onSuccess }: ReviewModalProps) {
	const { data: session } = useSession()
	const [rating, setRating] = useState(0)
	const [hoveredRating, setHoveredRating] = useState(0)
	const [review, setReview] = useState('')
	const [loading, setLoading] = useState(false)

	if (!book) return null

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!session) {
			signIn('google')
			return
		}

		if (rating === 0) {
			alert('별점을 선택해주세요')
			return
		}

		if (!review.trim()) {
			alert('이 책에 대해 요약해주세요')
			return
		}

		setLoading(true)

		try {
			await axios.post('/api/reviews', {
				bookData: book,
				rating,
				review,
			})

			alert('책장에 등록되었습니다! 🎉')
			onSuccess()
			onClose()
		} catch (error: unknown) {
			console.error('리뷰 저장 오류:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					{/* 헤더 */}
					<div className="flex justify-between items-start mb-6">
						<h2 className="text-2xl font-bold text-gray-900">독후감 작성</h2>
						<button onClick={onClose} className="text-gray-400 hover:text-gray-600">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
						{book?.thumbnail ? (
							<Image
								src={book?.thumbnail}
								alt={book?.title || ''}
								className="object-cover rounded"
								width={80}
								height={112}
							/>
						) : (
							<div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center">
								<span className="text-3xl">📖</span>
							</div>
						)}
						<div className="flex-1">
							<h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
							<p className="text-sm text-gray-600">{book.author}</p>
							<p className="text-xs text-gray-500 mt-1">
								{book.publisher}{' '}
								{book.publishedDate && `· ${book.publishedDate.substring(0, 4)}`}
							</p>
						</div>
					</div>

					{/* 로그인 안내 */}
					{!session && (
						<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<p className="text-sm text-blue-800">이 책을 등록하려면 로그인이 필요합니다</p>
						</div>
					)}

					<form onSubmit={handleSubmit}>
						{/* 별점 */}
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">별점</label>
							<div className="flex gap-2">
								{[1, 2, 3, 4, 5].map(star => (
									<button
										key={star}
										type="button"
										onClick={() => setRating(star)}
										onMouseEnter={() => setHoveredRating(star)}
										onMouseLeave={() => setHoveredRating(0)}
										className="text-4xl focus:outline-none transition-transform hover:scale-110"
									>
										{star <= (hoveredRating || rating) ? '★' : '☆'}
									</button>
								))}
							</div>
						</div>

						{/* 독후감 */}
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">요약</label>
							<textarea
								value={review}
								onChange={e => setReview(e.target.value)}
								rows={5}
								placeholder="이 책을 읽고 느낀 점을 자유롭게 작성해보세요..."
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
							/>
						</div>

						{/* 버튼 */}
						<div className="flex gap-3">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								취소
							</button>
							<button
								type="submit"
								disabled={loading}
								className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? '저장 중...' : session ? '내 책장에 등록' : '로그인하고 등록'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
