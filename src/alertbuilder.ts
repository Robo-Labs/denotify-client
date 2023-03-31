import { Alert } from './denotifyclient.js'

import {
	NotificationConfig,
	NotificationTypeId
} from './notifications/notification.js'
import { DiscordWebhook } from './notifications/notify_discord_webhook.js'
import { Email } from './notifications/notify_email.js'
import { Telegram } from './notifications/notify_telegram.js'
import { PollFunctionV1 } from './triggers/handler_function_call.js'
import { PollFunctionV2 } from './triggers/handler_function_call_v2.js'
import { OnchainEventV1 } from './triggers/handler_onchain_event.js'
import { OnchainEventV2 } from './triggers/handler_onchain_event_v2.js'
import {
	Network,
	Trigger,
	TriggerHelper,
	TriggerTypeId
} from './triggers/trigger.js'

export class AlertBuilder {
	private network?: Network
	private triggerId?: TriggerTypeId
	private trigger?: Trigger
	private notificationId?: NotificationTypeId
	private notification?: NotificationConfig

	private constructor(private name: string) {}

	public static create(name: string) {
		return new AlertBuilder(name)
	}

	public onNetwork(network: Network): AlertBuilder {
		this.network = network
		return this
	}

	/**
	 * Call withTrigger with one of the TriggerConfig types:
	 * PollFunctionV2 | PollFunctionV1 | OnchainEventV1
	 * @param id Simple ID
	 * @param options Desired trigger configuration
	 * @returns self for piping
	 */
	public withTrigger<TTriggerTypeId extends TriggerTypeId>(
		id: TTriggerTypeId,
		options: TTriggerTypeId extends 'PollFunctionV2'
			? Partial<PollFunctionV2>
			: TTriggerTypeId extends 'OnchainEventV2'
			? Partial<OnchainEventV2>
			: TTriggerTypeId extends 'PollFunctionV1'
			? Partial<PollFunctionV1>
			: TTriggerTypeId extends 'OnchainEventV1'
			? OnchainEventV1
			: never
	): AlertBuilder {
		this.triggerId = id
		this.trigger = TriggerHelper.Validate(id, options)
		return this
	}

	public withNotification<TNotificationTypeId extends NotificationTypeId>(
		id: TNotificationTypeId,
		options: TNotificationTypeId extends 'Discord'
			? DiscordWebhook
			: TNotificationTypeId extends 'Telegram'
			? Telegram
			: TNotificationTypeId extends 'Email'
			? Email
			: never
	): AlertBuilder {
		this.notificationId = id
		this.notification = options
		return this
	}

	public async config(): Promise<Alert> {
		if (this.trigger === undefined || this.triggerId === undefined) {
			throw new Error('Trigger not configured')
		}

		if (this.notification === undefined || this.notificationId === undefined) {
			throw new Error('Notification not configured')
		}

		if (this.network === undefined) {
			throw new Error('Network not configured')
		}

		return {
			name: this.name,
			network: this.network,
			triggerId: this.triggerId,
			trigger: this.trigger,
			notificationId: this.notificationId,
			notification: this.notification
		}
	}
}
