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

// Types user is expossed to
export type NotificationTypeId = 'Discord' | 'Telegram' | 'Email'
export type NotificationConfig = DiscordWebhook | Telegram | Email

// Raw Schema Types
export type NotifyRawId =
	| NotifyDiscordWebhookRawId
	| NotifyTelegramRawId
	| NotifyEmailRawId
export type NotifyRawConfig =
	| NotifyDiscordWebhookRawConfig
	| NotifyTelegramRawConfig
	| NotifyEmailRawConfig
export type NotifyRawResponse =
	| NotifyDiscordWebhookRawResponse
	| NotifyTelegramRawResponse
	| NotifyEmailRawResponse
export type NotifyRawUpdate =
	| NotifyDiscordWebhookRawUpdate
	| NotifyTelegramRawUpdate
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

export class Notification {
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
		}
	}
}
