'use client'

import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'

type BookSearchFormProps = {
	onSearch: (query: string) => void
	loading?: boolean
}

export function BookSearchForm({ onSearch = () => {}, loading }: BookSearchFormProps) {
	const [query, setQuery] = useState('')

	const handleSubmit = () => {
		const currentQuery = query?.trim()
		if (!!currentQuery) {
			onSearch(currentQuery)
		}
	}

	return (
		<div className="w-full max-w-3xl mx-auto">
			<div className="flex gap-2 relative">
				<input
					type="text"
					value={query}
					onChange={e => setQuery(e.target.value)}
					placeholder="책 이름을 입력하세요."
					className="flex-1 px-4 py-3 text-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#51CD42] focus:shadow-[0_0_10px_0_rgba(81,205,66,0.5)]"
					disabled={loading}
				/>
				<button
					onClick={handleSubmit}
					disabled={loading || !query.trim()}
					className="absolute right-4 top-1/2 -translate-y-1/2"
				>
					<CiSearch size={24} color="#fff" />
				</button>
			</div>
		</div>
	)
}
