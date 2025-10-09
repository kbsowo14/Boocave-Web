import React from 'react'

interface FeedCardTextProps {
	text: string
	hashtagColor?: string
	className?: string
}

/**
 * @description
 * 텍스트에서 해시태그(#으로 시작하고 공백 전까지)를 감지하여 다른 색으로 표시
 */
export default function FeedCardText({
	text,
	hashtagColor = '#51CD42',
	className = '',
}: FeedCardTextProps) {
	if (!text) return null

	// 해시태그 패턴: #으로 시작하고 공백이 아닌 문자들
	const hashtagPattern = /(#[^\s]+)/g

	// 텍스트를 해시태그와 일반 텍스트로 분리
	const parts = text.split(hashtagPattern)

	return (
		<p className={className}>
			{parts.map((part, index) => {
				// 해시태그인 경우
				if (part.startsWith('#')) {
					return (
						<span key={index} style={{ color: hashtagColor }}>
							{part}
						</span>
					)
				}
				// 일반 텍스트인 경우
				return <span key={index}>{part}</span>
			})}
		</p>
	)
}
