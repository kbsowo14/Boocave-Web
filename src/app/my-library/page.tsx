'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { LoadingIndicator } from '@/components/LoadingIndicator'
import { MdOutlineImageNotSupported } from 'react-icons/md'
import { BookReview } from '@/types/book'
import { MdDeleteOutline } from 'react-icons/md'
import { FaRegEdit } from 'react-icons/fa'
import { useScreenSize } from '@/contexts/DeviceContext'

export default function MyLibrary() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { windowWidth = 0 } = useScreenSize()

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
			<div className=" pt-20 flex justify-center items-center">
				<LoadingIndicator />
			</div>
		)
	}

	if (!session) {
		return null
	}

	return (
		<div className="">
			<div className="px-4">
				<div className="py-8">
					<p className="text-white">
						총 <span className="font-semibold text-[#51CD42]">{reviews.length}권</span>의 책을
						기록했어요.
					</p>
				</div>

				{reviews?.length <= 0 ? (
					// 책이 없을 때
					<div className="text-center py-16">
						<div className="text-4xl mb-4">📚</div>
						<p className="text-lg font-semibold text-white mb-1">아직 등록된 책이 없습니다</p>
						<p className="text-white text-sm">첫 번째 책을 검색하고 리뷰를 작성해보세요!</p>
						<button
							onClick={() => router.push('/search')}
							className="text-sm font-bold text-[#51CD42] rounded-lg transition-colors mt-6"
						>
							추가하기 +
						</button>
					</div>
				) : (
					// 책이 있을 때
					<div className="gap-6 w-full flex-wrap flex flex-row justify-between items-end">
						{reviews?.map((review, index) => {
							const { thumbnail, title } = review?.book || {}
							return (
								<div
									key={index}
									className="flex rounded-r-lg rounded-l-sm overflow-hidden relative"
									onClick={() => setEditingReview(review)}
								>
									{/* 책 표지 */}
									{!thumbnail ? (
										<div className="bg-[#333333] w-24 h-36 flex justify-center items-center">
											<MdOutlineImageNotSupported size={24} color="#fff" />
										</div>
									) : (
										<Image
											src={thumbnail}
											alt={title || 'book'}
											className="object-cover"
											width={96}
											height={144}
										/>
									)}
									<div className="w-[2px] h-full bg-white/10 absolute left-[10px] top-0" />
									<div className="w-[2px] h-full bg-black/10 absolute left-[8px] top-0" />
								</div>
							)
						})}
					</div>
				)}
			</div>

			{/* 상세보기 모달 */}
			{editingReview && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							{/* 헤더 */}
							<div className="flex flex-row justify-between items-center mb-6">
								<div
									className="flex flex-row justify-start items-center"
									style={{ maxWidth: windowWidth - 102 - 16 }}
								>
									<p className="text-xl font-bold text-gray-900 truncate">
										{editingReview?.book?.title || ''}
									</p>
									<button
										onClick={() => {
											console.log('수정하기')
										}}
										className="ml-3"
									>
										<FaRegEdit size={18} color="#333333" className="-translate-y-[1px]" />
									</button>
								</div>
								<button
									className="flex"
									onClick={() => {
										if (!!editingReview?.id) {
											handleDelete(editingReview?.id)
										}
									}}
								>
									<MdDeleteOutline size={22} color="#C3C3C3" />
								</button>
							</div>

							{/* 책 정보 */}
							<div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
								{editingReview?.book?.thumbnail ? (
									<Image
										src={editingReview.book.thumbnail}
										alt={editingReview.book.title || ''}
										className="object-contain rounded"
										width={96}
										height={128}
									/>
								) : (
									<div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center">
										<span className="text-4xl">📖</span>
									</div>
								)}
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-900 mb-1">
										{editingReview?.book?.title || ''}
									</h3>
									<p className="text-sm text-gray-600">{editingReview?.book?.author || ''}</p>
									<p className="text-xs text-gray-500 mt-1">
										{editingReview?.book?.publisher || ''} ·{' '}
										{editingReview?.book?.publishedDate?.substring(0, 4)}
									</p>
									<div className="flex items-center mt-3">
										{[1, 2, 3, 4, 5].map(star => (
											<span key={star} className="text-2xl">
												{star <= (editingReview?.rating || 0) ? '★' : '☆'}
											</span>
										))}
									</div>
								</div>
							</div>

							{/* 리뷰 */}
							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-700 mb-2">내가 작성한 리뷰</h4>
								<div className="p-4 bg-gray-50 rounded-lg">
									<p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
										{editingReview?.review || ''}
									</p>
								</div>
							</div>

							{/* 날짜 */}
							<p className="text-sm text-gray-500 mb-6">
								작성일:{' '}
								{new Date(editingReview?.createdAt || '').toLocaleDateString('ko-KR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</p>

							<button
								onClick={() => setEditingReview(null)}
								className="w-full px-4 py-3 bg-[#51CD42] text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								확인
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
