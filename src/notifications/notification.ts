import { DiscordWebhook, NotifyDiscordWebhook, NotifyDiscordWebhookRawConfig, NotifyDiscordWebhookRawId, NotifyDiscordWebhookRawResponse, NotifyDiscordWebhookRawUpdate } from "./notify_discord_webhook"

// Types user is expossed to
export type NotificationTypeId = 'Discord'
export type NotificationConfig = DiscordWebhook

// Raw Schema Types
export type NotifyRawId = NotifyDiscordWebhookRawId
export type NotifyRawConfig = NotifyDiscordWebhookRawConfig
export type NotifyRawResponse = NotifyDiscordWebhookRawResponse
export type NotifyRawUpdate = NotifyDiscordWebhookRawUpdate


export type NotificationRawConfig = {
    name: string
    notify_type: NotifyRawId
    notify: NotifyRawConfig
}

export class Notification {
	public static SimpleToRaw(id: NotificationTypeId, config: NotificationConfig): NotificationRawConfig {
		switch(id) {
			case 'Discord': return NotifyDiscordWebhook.SimpleToRaw(config as DiscordWebhook)
		}
	}
}