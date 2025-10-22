'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'

export function BookSearchInput() {
	const [query, setQuery] = useState('')
	const router = useRouter()

	const handleSubmit = () => {
		const currentQuery = query?.trim()
		if (!!currentQuery) {
			router?.push(`/search?query=${currentQuery}`)
		}
	}

	return (
		<div className="w-full max-w-80 mx-auto">
			<div className="flex gap-2 relative">
				<input
					type="text"
					value={query}
					onChange={e => setQuery(e.target.value)}
					placeholder="책 이름을 입력하세요."
					className="flex-1 px-4 py-3 text-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#51CD42] focus:shadow-[0_0_10px_0_rgba(81,205,66,0.5)]"
				/>
				<button onClick={handleSubmit} className="absolute right-4 top-1/2 -translate-y-1/2">
					<CiSearch size={24} color="#fff" />
				</button>
			</div>
		</div>
	)
}
