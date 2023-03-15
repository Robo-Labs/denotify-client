import {
  NotificationConfig,
  NotificationTypeId
} from './notifications/notification.js'
import {
  DiscordWebhook,
  NotifyDiscordWebhook
} from './notifications/notify_discord_webhook.js'
import {
  HandlerFunctionCall,
  PollFunctionV1
} from './triggers/handler_function_call.js'
import {
  HandlerFunctionCallV2,
  PollFunctionV2
} from './triggers/handler_function_call_v2.js'
import {
  HandlerOnchainEvent,
  OnchainEventV1
} from './triggers/handler_onchain_event.js'
import { Network, TriggerConfig, TriggerTypeId } from './triggers/trigger.js'
import { AlertConfig } from './types/types.js'

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

  /**
   * Call withTrigger with one of the TriggerConfig types:
   * PollFunctionV2 | PollFunctionV1 | OnchainEventV1
   * @param id Simple ID
   * @param options Desired trigger configuration
   * @returns self for piping
   */
  public withTrigger<T>(id: TriggerTypeId, options: T): AlertBuilder {
    this.triggerId = id
    this.trigger = options as any
    return this
  }

  public withNotification<T = NotificationConfig>(
    id: NotificationTypeId,
    options: T
  ): AlertBuilder {
    this.notificationId = id
    this.notification = options as any
    return this
  }

  public async validate() {
    // Validate trigger
    switch (this.triggerId) {
      case 'OnchainEventV1':
        return HandlerOnchainEvent.validateCreate(this.trigger)
      case 'PollFunctionV1':
        return HandlerFunctionCall.validateCreate(this.trigger)
      case 'PollFunctionV2':
        return HandlerFunctionCallV2.validateCreate(this.trigger)
    }
    switch (this.notificationId) {
      case 'Discord':
        return NotifyDiscordWebhook.validateCreate(this.notification)
      default:
        throw new Error('Invalid notification type')
    }
  }

  public async config(): Promise<AlertConfig> {
    if (this.trigger === undefined || this.triggerId === undefined) {
      throw new Error('Trigger not configured')
    }

    if (this.notification === undefined || this.notificationId === undefined) {
      throw new Error('Notification not configured')
    }

    if (this.network === undefined) {
      throw new Error('Network not configured')
    }

    await this.validate()

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
