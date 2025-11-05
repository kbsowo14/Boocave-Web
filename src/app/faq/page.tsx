'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

type FAQItem = {
	id: number
	question: string
	answer: string
}

export default function FAQ() {
	const router = useRouter()
	const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

	const faqList = useMemo<FAQItem[]>(
		() => [
			{
				id: 1,
				question: '앱은 어떻게 사용하나요?',
				answer:
					'앱에 로그인한 후 도서를 검색하고 리뷰를 작성할 수 있습니다. 내 서재에서 읽은 책들을 관리하고 다른 사용자들과 소통할 수 있습니다.',
			},
			{
				id: 2,
				question: '리뷰는 어떻게 작성하나요?',
				answer:
					'도서 상세 페이지에서 리뷰 작성 버튼을 클릭하면 별점과 함께 리뷰를 작성할 수 있습니다. 사진 첨부도 가능합니다.',
			},
			{
				id: 3,
				question: '알림 설정은 어디서 하나요?',
				answer:
					'환경설정 > 알림 설정 메뉴에서 앱 알림, 리뷰 알림, 댓글 알림 등을 개별적으로 설정할 수 있습니다.',
			},
			{
				id: 4,
				question: '계정을 삭제할 수 있나요?',
				answer:
					'환경설정 > 계정 정보 메뉴에서 계정 삭제를 진행할 수 있습니다. 계정 삭제 시 모든 데이터가 영구적으로 삭제되므로 신중하게 결정해주세요.',
			},
			{
				id: 5,
				question: '로그인은 어떻게 하나요?',
				answer:
					'구글 계정을 통해 간편하게 로그인할 수 있습니다. 로그인 페이지에서 구글 로그인 버튼을 클릭하시면 됩니다.',
			},
			{
				id: 6,
				question: '팔로우 기능은 어떻게 사용하나요?',
				answer:
					'다른 사용자의 프로필 페이지에서 팔로우 버튼을 클릭하면 해당 사용자를 팔로우할 수 있습니다. 팔로우한 사용자의 활동을 피드에서 확인할 수 있습니다.',
			},
		],
		[]
	)

	const toggleItem = (id: number) => {
		const newExpanded = new Set(expandedItems)
		if (newExpanded.has(id)) {
			newExpanded.delete(id)
		} else {
			newExpanded.add(id)
		}
		setExpandedItems(newExpanded)
	}

	return (
		<div className="w-full min-h-screen relative">
			{/* Header */}
			<div className="px-4 py-6 border-b-[1px] border-white/20">
				<button onClick={() => router.back()} className="text-white text-base mb-2">
					← 뒤로
				</button>
				<h1 className="text-white text-2xl font-bold">자주 묻는 질문</h1>
			</div>

			{/* FAQ List */}
			<div className="w-full">
				{faqList.map(faq => {
					const isExpanded = expandedItems.has(faq.id)
					return (
						<div key={faq.id} className="w-full border-b-[1px] border-white/20">
							<button
								onClick={() => toggleItem(faq.id)}
								className="w-full flex flex-row justify-between items-center px-6 py-4"
							>
								<p className="text-white text-sm font-medium text-left flex-1">
									{faq.question}
								</p>
								{isExpanded ? (
									<FaAngleUp size={16} color="#fff" className="ml-4 flex-shrink-0" />
								) : (
									<FaAngleDown size={16} color="#fff" className="ml-4 flex-shrink-0" />
								)}
							</button>
							{isExpanded && (
								<div className="px-6 pb-4">
									<p className="text-white/70 text-sm leading-relaxed">{faq.answer}</p>
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
