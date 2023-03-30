import { NotificationRawConfig } from './notification.js'
import * as yup from 'yup'

// Simple Config
export type Email = {
	email: string
	subject: string | null
	html: string
}

export const EmailSchema = yup.object({
	email: yup.string().required(),
	subject: yup.string(),
	html: yup.string().required()
})

// Raw Config
export type NotifyEmailRawId = 'notify_email'
export const NOTIFY_EMAIL_RAW_ID = 'notify_email'

export type NotifyEmailRawConfig = {
	email: string
	subject?: string
	html: string
}

export type NotifyEmailRawResponse = {
	id: number
	created_at: string
	email: string
	subject: string | null
	html: string
}

export type NotifyEmailRawUpdate = {
	email?: string
	subject?: string
	html?: string
}

export class NotifyEmail {
	public static async SimpleToRaw(
		config: Email
	): Promise<NotificationRawConfig> {
		return {
			name: '', // deprecated
			notify_type: NOTIFY_EMAIL_RAW_ID,
			notify: await NotifyEmail.validateCreate(config)
		}
	}

	public static async validateCreate(
		options: Email
	): Promise<NotifyEmailRawConfig> {
		return EmailSchema.validate(options)
	}
}
