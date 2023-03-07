import { NotificationConfig, NotificationTypeId } from "./notifications/notification"
import { Network, TriggerConfig, TriggerTypeId } from "./triggers/trigger"
import { AlertConfig } from "./types/types"

export class AlertBuilder {

	private network?: Network
	private triggerId?: TriggerTypeId
	private trigger?: TriggerConfig
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

	public withTrigger<T = TriggerConfig>(id: TriggerTypeId, options: T): AlertBuilder {
		this.triggerId = id
		this.trigger = options as any
		return this
	}
	
	public withNotification<T = NotificationConfig>(id: NotificationTypeId, options: T): AlertBuilder {
		this.notificationId = id
		this.notification = options as any
		return this
	}

	public config(): AlertConfig {
		if (this.trigger === undefined || this.triggerId === undefined)
			throw new Error('Trigger not configured')

		if (this.notification === undefined || this.notificationId === undefined)
			throw new Error('Notification not configured')
		
		if (this.network === undefined) 
			throw new Error('Network not configured')

		return {
			name: this.name,
			network: this.network,
			triggerId: this.triggerId,
			trigger: this.trigger,
			notificationId: this.notificationId,
			notification: this.notification,
		}
	}
}