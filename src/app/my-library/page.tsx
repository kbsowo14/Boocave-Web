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
import { useToastStore } from '@/stores/useToastStore'
import { FaStar } from 'react-icons/fa'

export default function MyLibrary() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { showToast } = useToastStore()

	const [reviews, setReviews] = useState<BookReview[]>([])
	const [loading, setLoading] = useState(true)
	const [editingReview, setEditingReview] = useState<BookReview | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [editReview, setEditReview] = useState('')

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

	// 편집할 리뷰가 변경될 때 편집 상태 초기화
	useEffect(() => {
		if (editingReview) {
			setIsEditing(false)
			setEditReview('')
		}
	}, [editingReview])

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
			showToast('삭제되었습니다')
			setEditingReview(null)
			router.refresh()
		} catch (error) {
			console.error('삭제 오류:', error)
			showToast('삭제에 실패했습니다')
		}
	}

	const handleEdit = () => {
		if (editingReview) {
			console.log('편집할 리뷰:', editingReview)
			console.log('리뷰 내용:', editingReview.review)
			console.log('현재 평점:', editingReview.rating)
			setEditReview(editingReview.review || '')
			setIsEditing(true)
		}
	}

	const handleCancelEdit = () => {
		setIsEditing(false)
		setEditReview('')
	}

	/**
	 * @description
	 * 리뷰 수정 핸들러
	 */
	const handleSaveEdit = async () => {
		if (!editingReview?.id) return

		try {
			await axios.patch(`/api/reviews/${editingReview.id}`, {
				review: editReview,
			})

			// 로컬 상태 업데이트 (리뷰 내용만 업데이트)
			setReviews(
				reviews.map(r =>
					r.id === editingReview.id
						? {
								...r,
								review: editReview,
							}
						: r
				)
			)

			showToast('수정이 완료되었어요!')
			setIsEditing(false)
			setEditReview('')
			setEditingReview(null)
			router.refresh()
		} catch (error) {
			console.error('리뷰 수정 오류:', error)
			showToast('리뷰 수정에 실패했어요!')
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
		<div className="w-full min-h-screen flex flex-col justify-start items-center">
			<div className="px-4 w-full">
				<div className="py-8">
					<p className="text-white">
						총 <span className="font-semibold text-[#51CD42]">{reviews.length}권</span>의 책을
						읽었습니다!
					</p>
				</div>

				{reviews?.length <= 0 ? (
					// 책이 없을 때
					<div className="text-center py-16">
						<div className="text-4xl mb-4">📚</div>
						<p className="text-lg font-semibold text-white mb-1">아직 등록된 책이 없습니다</p>
						<p className="text-white text-sm">첫 번째 책을 검색하고 리뷰를 작성해보세요!</p>
						<button
							onClick={() => router.push('/')}
							className="text-sm font-bold text-[#51CD42] rounded-lg transition-colors mt-6"
						>
							추가하기 +
						</button>
					</div>
				) : (
					// 책이 있을 때
					<div className="gap-6 w-full flex-wrap flex flex-row justify-start items-end">
						{reviews?.map((review, index) => {
							const { thumbnail, title } = review?.book || {}
							return (
								<div
									key={index}
									className="flex rounded-r-lg rounded-l-sm overflow-hidden relative"
									onClick={() => {
										setEditingReview(review)
									}}
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
					<div className="rounded-xl max-w-2xl w-full max-h-[90vh] bg-white flex flex-col">
						{/* 스크롤 가능한 콘텐츠 영역 */}
						<div className="flex-1 overflow-y-auto">
							<div className="p-6 pb-0">
								{/* 헤더 */}
								<div className="flex flex-row justify-between items-center mb-6">
									{/* Title */}
									<p className="text-xl font-bold text-gray-900 truncate pr-1">
										{editingReview?.book?.title || ''}
									</p>

									{/* Buttons */}
									<div className="flex flex-row justify-end items-center gap-2">
										{!isEditing ? (
											<>
												<button
													className="break-keep py-1 px-3 text-sm bg-[#51CD42] text-white rounded hover:bg-green-600 transition-colors"
													onClick={handleEdit}
												>
													편집
												</button>
												<button
													onClick={() => {
														if (!!editingReview?.id) {
															handleDelete(editingReview?.id)
														}
													}}
												>
													<MdDeleteOutline size={22} color="#C3C3C3" />
												</button>
											</>
										) : (
											<>
												<button
													className="break-keep px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
													onClick={handleCancelEdit}
												>
													취소
												</button>
												<button
													className="break-keep px-3 py-1 text-sm bg-[#51CD42] text-white rounded hover:bg-green-600 transition-colors"
													onClick={handleSaveEdit}
												>
													저장
												</button>
											</>
										)}
									</div>
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
										<div className="flex flex-row justify-start items-center mt-2">
											<FaStar size={16} color="#51CD42" />
											<span className="text-sm ml-1">
												{typeof editingReview?.rating === 'number'
													? editingReview?.rating?.toFixed(1)
													: '0.0'}
											</span>
										</div>
									</div>
								</div>

								{/* 리뷰 */}
								<div className="mb-6">
									<h4 className="text-sm font-medium text-gray-700 mb-2">내가 작성한 리뷰</h4>
									{isEditing ? (
										<textarea
											value={editReview}
											onChange={e => setEditReview(e.target.value)}
											className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#51CD42] focus:outline-none resize-none text-gray-900"
											rows={6}
											placeholder="리뷰를 작성해주세요..."
										/>
									) : (
										<div className="p-4 bg-gray-50 rounded-lg">
											<p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
												{editingReview?.review || ''}
											</p>
										</div>
									)}
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
							</div>
						</div>

						{/* 고정된 하단 버튼 */}
						<div className="p-6 pt-0">
							<button
								onClick={() => {
									setEditingReview(null)
									setIsEditing(false)
									setEditReview('')
								}}
								className="w-full px-4 py-3 bg-[#51CD42] text-white rounded-lg"
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
