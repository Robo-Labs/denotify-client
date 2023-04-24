import {
	DiscordWebhook,
	NotifyDiscordWebhook,
	NotifyDiscordWebhookRawConfig,
	NotifyDiscordWebhookRawId,
	NotifyDiscordWebhookRawResponse,
	NotifyDiscordWebhookRawUpdate
} from './notify_discord_webhook.js'
import {
	Email,
	NotifyEmail,
	NotifyEmailRawConfig,
	NotifyEmailRawId,
	NotifyEmailRawResponse,
	NotifyEmailRawUpdate
} from './notify_email.js'
import {
	NotifyTelegram,
	NotifyTelegramRawConfig,
	NotifyTelegramRawId,
	NotifyTelegramRawResponse,
	NotifyTelegramRawUpdate,
	Telegram
} from './notify_telegram.js'
import {
	NotifyWebhook,
	NotifyWebhookRawConfig,
	NotifyWebhookRawId,
	NotifyWebhookRawResponse,
	NotifyWebhookRawUpdate,
	Webhook
} from './notify_webhook.js'

// Types user is expossed to
export type NotificationTypeId = 'Discord' | 'Telegram' | 'Email' | 'Webhook'
export type NotificationConfig = DiscordWebhook | Telegram | Email | Webhook

export type Notification = NotificationConfig & {
	error?: boolean
	error_message?: string | null
	error_timestamp?: number | null
}

// Raw Schema Types
export type NotifyRawId =
	| NotifyDiscordWebhookRawId
	| NotifyTelegramRawId
	| NotifyEmailRawId
	| NotifyWebhookRawId
export type NotifyRawConfig =
	| NotifyDiscordWebhookRawConfig
	| NotifyTelegramRawConfig
	| NotifyEmailRawConfig
	| NotifyWebhookRawConfig
export type NotifyRawResponse =
	| NotifyDiscordWebhookRawResponse
	| NotifyTelegramRawResponse
	| NotifyEmailRawResponse
	| NotifyWebhookRawResponse
export type NotifyRawUpdate =
	| NotifyDiscordWebhookRawUpdate
	| NotifyTelegramRawUpdate
	| NotifyWebhookRawUpdate
	| NotifyEmailRawUpdate

export type NotificationRawConfig = {
	name: string
	notify_type: NotifyRawId
	notify: NotifyRawConfig
}

export type NotificationRawResponse = {
	notify_type: NotifyRawId
	notify: NotifyRawResponse
	error: boolean
	error_message: string | null
	error_timestamp: number | null
}

export class NotificationHelper {
	public static async SimpleToRaw(
		id: NotificationTypeId,
		config: NotificationConfig
	): Promise<NotificationRawConfig> {
		switch (id) {
			case 'Discord':
				return NotifyDiscordWebhook.SimpleToRaw(config as DiscordWebhook)
			case 'Telegram':
				return NotifyTelegram.SimpleToRaw(config as Telegram)
			case 'Email':
				return NotifyEmail.SimpleToRaw(config as Email)
			case 'Webhook':
				return NotifyWebhook.SimpleToRaw(config as Webhook)
		}
	}

	public static RawToSimple(raw: NotificationRawResponse): Notification {
		return {
			...raw.notify,
			error: raw.error,
			error_message: raw.error_message,
			error_timestamp: raw.error_timestamp
		}
	}

	public static RawTypeToSimpleType(id: NotifyRawId): NotificationTypeId {
		switch (id) {
			case 'notify_discord_webhook':
				return 'Discord'
			case 'notify_telegram':
				return 'Telegram'
			case 'notify_email':
				return 'Email'
			case 'notify_webhook':
				return 'Webhook'
		}
	}

	public static SimpleTypeToRawType(id: NotificationTypeId): NotifyRawId {
		switch (id) {
			case 'Discord':
				return 'notify_discord_webhook'
			case 'Telegram':
				return 'notify_telegram'
			case 'Email':
				return 'notify_email'
			case 'Webhook':
				return 'notify_webhook'
		}
	}
}
