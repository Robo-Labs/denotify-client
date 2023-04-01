import { NotificationRawConfig } from './notification.js'
import * as yup from 'yup'

type DiscordEmbedOptions = {
	type?: string
	title?: string
	color?: number
	thumbnail?: {
		url?: string
		height?: number
		width?: number
	}
	image?: {
		url?: string
		height?: number
		width?: number
	}
	url?: string
}

// Simple Config
export type DiscordWebhook = {
	url: string
	username?: string
	avatar_url?: string
	message: string
	embed?: DiscordEmbedOptions
}

const ImageSchema = yup.object({
	url: yup.string(),
	height: yup.number(),
	width: yup.number()
})

const EmbedSchema = yup.object({
	type: yup.string().default('rich'),
	title: yup.string(),
	color: yup.number(),
	thumbnail: ImageSchema,
	image: ImageSchema,
	url: yup.string()
})

export const DiscordWebhookSchema = yup.object({
	url: yup.string().url().required(),
	username: yup.string(),
	avatar_url: yup.string().url(),
	message: yup.string().required(),
	embed: EmbedSchema
})

// Raw Config
export type NotifyDiscordWebhookRawId = 'notify_discord_webhook'
export const NOTIFY_DISCORD_WEBHOOK_RAW_ID = 'notify_discord_webhook'

export type NotifyDiscordWebhookRawConfig = {
	url: string
	username?: string
	avatar_url?: string
	message: string
	embed?: DiscordEmbedOptions
}

export type NotifyDiscordWebhookRawResponse = {
	id: number
	created_at: string
	url: string
	username: string
	avatar_url: string
	message: string
	embed?: DiscordEmbedOptions
}

export type NotifyDiscordWebhookRawUpdate = {
	url?: string
	username?: string
	avatar_url?: string
	message?: string
	embed?: DiscordEmbedOptions
}

export class NotifyDiscordWebhook {
	public static async SimpleToRaw(
		config: DiscordWebhook
	): Promise<NotificationRawConfig> {
		return {
			name: '', // deprecated
			notify_type: NOTIFY_DISCORD_WEBHOOK_RAW_ID,
			notify: await NotifyDiscordWebhook.validateCreate(config)
		}
	}

	public static validateCreate(options: DiscordWebhook) {
		return DiscordWebhookSchema.validate(options)
	}
}
