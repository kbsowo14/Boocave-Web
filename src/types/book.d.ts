export type BookReview = {
	id?: string
	rating?: number
	review?: string
	createdAt?: string
	user_name?: string
	book?: {
		id?: string
		title?: string
		author?: string
		thumbnail?: string
		publisher?: string
		publishedDate?: string
	}
}
