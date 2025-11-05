'use client'

import { useMemo, useState } from 'react'
import { FaAngleRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

type ToggleItem = {
	label: string
	type: 'toggle'
	value: boolean
	onChange: (value: boolean) => void
}

type ButtonItem = {
	label: string
	type: 'button'
	onPress: () => void
}

type InfoItem = {
	label: string
	type: 'info'
	value: string
}

type SettingItem = ToggleItem | ButtonItem | InfoItem

type SettingSection = {
	title: string
	items: SettingItem[]
}

export default function Setting() {
	const router = useRouter()
	const [isNotificationEnabled, setIsNotificationEnabled] = useState(true)
	const [isReviewNotificationEnabled, setIsReviewNotificationEnabled] = useState(true)
	const [isCommentNotificationEnabled, setIsCommentNotificationEnabled] = useState(true)

	const settingSections = useMemo<SettingSection[]>(
		() => [
			{
				title: '알림 설정',
				items: [
					{
						label: '앱 알림',
						type: 'toggle',
						value: isNotificationEnabled,
						onChange: setIsNotificationEnabled,
					},
					{
						label: '리뷰 알림',
						type: 'toggle',
						value: isReviewNotificationEnabled,
						onChange: setIsReviewNotificationEnabled,
					},
					{
						label: '댓글 알림',
						type: 'toggle',
						value: isCommentNotificationEnabled,
						onChange: setIsCommentNotificationEnabled,
					},
				],
			},
			{
				title: '계정',
				items: [
					{
						label: '계정 정보',
						type: 'button',
						onPress: () => {
							console.log('계정 정보 클릭')
						},
					},
					{
						label: '비밀번호 변경',
						type: 'button',
						onPress: () => {
							console.log('비밀번호 변경 클릭')
						},
					},
				],
			},
			{
				title: '개인정보',
				items: [
					{
						label: '개인정보 처리방침',
						type: 'button',
						onPress: () => {
							console.log('개인정보 처리방침 클릭')
						},
					},
					{
						label: '이용약관',
						type: 'button',
						onPress: () => {
							console.log('이용약관 클릭')
						},
					},
				],
			},
			{
				title: '고객지원',
				items: [
					{
						label: '문의하기',
						type: 'button',
						onPress: () => {
							console.log('문의하기 클릭')
						},
					},
					{
						label: '자주 묻는 질문',
						type: 'button',
						onPress: () => {
							router.push('/faq')
						},
					},
				],
			},
			{
				title: '앱 정보',
				items: [
					{
						label: '앱 버전',
						type: 'info',
						value: '1.0.0',
					},
				],
			},
		],
		[isNotificationEnabled, isReviewNotificationEnabled, isCommentNotificationEnabled, router]
	)

	return (
		<div className="w-full min-h-screen relative">
			{/* Header */}
			<div className="px-4 py-6 border-b-[1px] border-white/20">
				<button onClick={() => router.back()} className="text-white text-base mb-2">
					← 뒤로
				</button>
				<h1 className="text-white text-2xl font-bold">환경설정</h1>
			</div>

			{/* Settings */}
			<div className="w-full">
				{settingSections.map((section, sectionIndex) => (
					<div key={sectionIndex} className="w-full mt-6">
						{section.title && (
							<div className="px-4 mb-2">
								<p className="text-white/60 text-xs font-bold uppercase">{section.title}</p>
							</div>
						)}
						<div className="w-full border-t-[1px] border-white/20">
							{section.items.map((item, itemIndex) => {
								if (item.type === 'toggle') {
									const toggleItem = item as ToggleItem
									return (
										<div
											key={itemIndex}
											className="w-full flex flex-row justify-between items-center px-6 py-4 border-b-[1px] border-white/20"
										>
											<p className="text-white text-sm">{toggleItem.label}</p>
											<button
												onClick={() => toggleItem.onChange(!toggleItem.value)}
												className={`relative w-12 h-6 rounded-full transition-colors ${
													toggleItem.value ? 'bg-blue-500' : 'bg-gray-600'
												}`}
											>
												<div
													className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
														toggleItem.value ? 'translate-x-6' : 'translate-x-0'
													}`}
												/>
											</button>
										</div>
									)
								}

								if (item.type === 'info') {
									const infoItem = item as InfoItem
									return (
										<div
											key={itemIndex}
											className="w-full flex flex-row justify-between items-center px-6 py-4 border-b-[1px] border-white/20"
										>
											<p className="text-white text-sm">{infoItem.label}</p>
											<p className="text-white/60 text-sm">{infoItem.value}</p>
										</div>
									)
								}

								const buttonItem = item as ButtonItem
								return (
									<button
										key={itemIndex}
										className="w-full flex flex-row justify-between items-center px-6 py-4 border-b-[1px] border-white/20"
										onClick={buttonItem.onPress}
									>
										<p className="text-white text-sm">{buttonItem.label}</p>
										<FaAngleRight size={16} color="#fff" />
									</button>
								)
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
