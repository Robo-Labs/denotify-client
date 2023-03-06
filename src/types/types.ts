
// DeNotify supports either email/password or API key authentication
export type DeNotifyOptions = {

	// email / Password Auth
	email?: string
	password?: string
	projectId?: string // Supabase project id

	// Key auth
	key?: string
	url?: string

	// options
	anonKey?: string
}
