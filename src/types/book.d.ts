export type BookReview = {
	id?: string
	rating?: number
	review?: string
	createdAt?: string
	user_name?: string
	review_images?: string[] | number[]
	is_liked?: boolean
	like_count?: number
	comment_count?: number
	is_pinned?: boolean
	book?: {
		id?: string
		title?: string
		author?: string
		thumbnail?: string
		publisher?: string
		publishedDate?: string
	}
}
