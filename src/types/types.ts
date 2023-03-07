import { NotificationConfig, NotificationTypeId } from "./notification"
import { TriggerConfig, TriggerTypeId } from "../triggers/trigger"

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
	triggerId: TriggerTypeId
	trigger: TriggerConfig
	notificationId: NotificationTypeId
	notification: NotificationConfig
}