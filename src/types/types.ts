import { NotificationConfig, NotificationTypeId } from "../notifications/notification.js"
import { Network, TriggerConfig, TriggerTypeId } from "../triggers/trigger.js"

export type Condition = '>' | '>=' | '<' | '<=' | '=' | 'true'
export type TriggerOn = 'event' | 'latch'

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

export type AlertConfig = { 
	name: string
	network: Network
	triggerId: TriggerTypeId
	trigger: TriggerConfig
	notificationId: NotificationTypeId
	notification: NotificationConfig
}