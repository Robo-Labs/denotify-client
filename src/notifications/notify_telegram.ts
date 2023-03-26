import { NotificationRawConfig } from './notification.js'
import * as yup from 'yup'

// Simple Config
export type Telegram = {
	clientId: number
	content: string
}

export const TelegramSchema = yup.object({
	clientId: yup.number().required(),
	content: yup.string().required()
})

// Raw Config
export type NotifyTelegramRawId = 'notify_telegram'
export const NOTIFY_TELEGRAM_RAW_ID = 'notify_telegram'

export type NotifyTelegramRawConfig = {
	clientId: number
	content: string
}

export type NotifyTelegramRawResponse = {
	id: number
	created_at: string
	clientId: number
	content: string
}

export type NotifyTelegramRawUpdate = {
	clientId: number
	content: string
}

export class NotifyTelegram {
	public static async SimpleToRaw(
		config: Telegram
	): Promise<NotificationRawConfig> {
		return {
			name: '', // deprecated
			notify_type: NOTIFY_TELEGRAM_RAW_ID,
			notify: await NotifyTelegram.validateCreate(config)
		}
	}

	public static validateCreate(options: Telegram) {
		return TelegramSchema.validate(options)
	}
}
