import { HandlerFunctionCallRawConfig, HandlerFunctionCallUpdate, PollFunctionV1 } from "./handler_function_call"
import { HandlerOnchainEventRawConfig, HandlerOnchainEventUpdate, OnchainEventV1 } from "./handler_onchain_event"
import { HandlerFunctionCallV2, HandlerFunctionCallV2RawConfig, HandlerFunctionCallV2Update, PollFunctionV2 } from "./handler_function_call_v2"

export type Network = 
	'avalanche' | 
	'ethereum'

// Simple Types
export type TriggerConfig = PollFunctionV2 | PollFunctionV1 | OnchainEventV1
export type TriggerTypeId = 
	'PollFunctionV2' | 
	'OnchainEventV2' | 
	'FunctionEventV2'

export type TriggerUpdate = 
	HandlerFunctionCallV2Update |
	HandlerFunctionCallUpdate | 
	HandlerOnchainEventUpdate

// Raw Types
export type TriggerTypeRawId = 
	'handler_function_call' | 
	'onchain_event_call_v2' |
	'handler_function_call_v2' 

export type TriggerOn = 'event' | 'latch'
export type HandlerRawConfig = 
	HandlerFunctionCallRawConfig |
	HandlerOnchainEventRawConfig |
	HandlerFunctionCallV2RawConfig

export type TriggerRawConfig = {
    nickname: string
    type: TriggerTypeRawId
    alertType: TriggerOn
	network: Network
    handler: HandlerRawConfig
}

export class Trigger {
	public static SimpleToRaw(name: string, id: TriggerTypeId, network: Network, config: TriggerConfig): TriggerRawConfig {
		switch(id) {
			case 'PollFunctionV2': return HandlerFunctionCallV2.SimpleToRaw(name, network, config as PollFunctionV2)
			default:
				throw new Error('Invalid Trigger ID')
		}
	}
}