import { NotificationRawConfig } from './notification.js'
import * as yup from 'yup'

// Simple Config
export type Webhook = {
	url: string
	params?: { [key: string]: string } | null
	pathname?: string | null
	access_token?: string | null
	headers?: { [key: string]: string } | null
	method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
}

export const WebhookSchema = yup.object({
	url: yup.string().required(),
	params: yup.object().nullable().default(null),
	pathname: yup.string().nullable().default(null),
	access_token: yup.string().nullable().default(null),
	headers: yup.object().nullable().default(null),
	method: yup
		.string()
		.oneOf(['get', 'post', 'put', 'delete', 'patch'])
		.default('post')
})

// Raw Config
export type NotifyWebhookRawId = 'notify_webhook'
export const NOTIFY_WEBHOOK_RAW_ID = 'notify_webhook'

export type NotifyWebhookRawConfig = {
	url: string
	params: { [key: string]: string } | null
	pathname: string | null
	access_token: string | null
	headers: { [key: string]: string } | null
	method: 'get' | 'post' | 'put' | 'delete' | 'patch'
}

export type NotifyWebhookRawResponse = {
	url: string
	params: { [key: string]: string } | null
	pathname: string | null
	access_token: string | null
	headers: { [key: string]: string } | null
	method: 'get' | 'post' | 'put' | 'delete' | 'patch'
}

export type NotifyWebhookRawUpdate = {
	url?: string
	params?: { [key: string]: string } | null
	pathname?: string | null
	access_token?: string | null
	headers?: { [key: string]: string } | null
	method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
}

export class NotifyWebhook {
	public static async SimpleToRaw(
		config: Webhook
	): Promise<NotificationRawConfig> {
		return {
			name: '', // deprecated
			notify_type: NOTIFY_WEBHOOK_RAW_ID,
			notify: await NotifyWebhook.validateCreate(config)
		}
	}

	public static async validateCreate(
		options: Webhook
	): Promise<NotifyWebhookRawConfig> {
		return WebhookSchema.validate(options)
	}
}
