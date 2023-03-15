import {
  HandlerFunctionCall,
  HandlerFunctionCallRawConfig,
  HandlerFunctionCallRawResponse,
  HandlerFunctionCallUpdate,
  PollFunctionV1
} from './handler_function_call.js'
import {
  HandlerOnchainEvent,
  HandlerOnchainEventRawConfig,
  HandlerOnchainEventRawResponse,
  HandlerOnchainEventUpdate,
  OnchainEventV1
} from './handler_onchain_event.js'
import {
  HandlerFunctionCallV2,
  HandlerFunctionCallV2RawConfig,
  HandlerFunctionCallV2RawResponse,
  HandlerFunctionCallV2Update,
  PollFunctionV2
} from './handler_function_call_v2.js'

export type Network = 'avalanche' | 'ethereum'

// Simple Types
export type TriggerConfig = PollFunctionV2 | PollFunctionV1 | OnchainEventV1
export type TriggerTypeId =
  | 'PollFunctionV2'
  | 'OnchainEventV1'
  | 'PollFunctionV1'

export type TriggerUpdate =
  | HandlerFunctionCallV2Update
  | HandlerFunctionCallUpdate
  | HandlerOnchainEventUpdate

// Raw Types
export type TriggerTypeRawId =
  | 'handler_function_call'
  | 'handler_onchain_event'
  | 'handler_function_call_v2'

export type TriggerOn = 'event' | 'latch'
export type HandlerRawConfig =
  | HandlerFunctionCallRawConfig
  | HandlerOnchainEventRawConfig
  | HandlerFunctionCallV2RawConfig

export type TriggerRawConfig = {
  nickname: string
  type: TriggerTypeRawId
  alertType: TriggerOn
  network: Network
  handler: HandlerRawConfig
}

export type HandlerRawResponse =
  | HandlerFunctionCallV2RawResponse
  | HandlerFunctionCallRawResponse
  | HandlerOnchainEventRawResponse

export type TriggerRawResponse = {
  id: number
  type: TriggerTypeRawId
  triggered: boolean
  lastBlock: number
  alertType: 'event' | 'latch' // deprecated
  enabled: boolean
  nickname: string
  error: boolean
  error_message: string | null
  error_timestamp: number | null
  network: Network
  handler: HandlerRawResponse
}

export class Trigger {
  public static SimpleToRaw(
    name: string,
    id: TriggerTypeId,
    network: Network,
    config: TriggerConfig
  ): TriggerRawConfig {
    switch (id) {
      case 'PollFunctionV2':
        return HandlerFunctionCallV2.SimpleToRaw(
          name,
          network,
          config as PollFunctionV2
        )
      case 'PollFunctionV1':
        return HandlerFunctionCall.SimpleToRaw(
          name,
          network,
          config as PollFunctionV1
        )
      case 'OnchainEventV1':
        return HandlerOnchainEvent.SimpleToRaw(
          name,
          network,
          config as OnchainEventV1
        )
      default:
        throw new Error('Invalid Trigger ID')
    }
  }
}
