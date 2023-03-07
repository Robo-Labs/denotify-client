import { Condition } from "../util/filter.js"
import { Network, TriggerRawConfig } from "./trigger.js"

const HANDLER_ONCHAIN_EVENT_V1_RAW_ID = 'handler_onchain_event'

export type OnchainEventV1 = {
    address: string
    event: string
    abi: any
    condition: Condition
    paramsIndex?: number
    paramsDecimals?: number
    constant?: number
}

export type HandlerOnchainEventRawConfig = {
    address: string
    event: string
    abi: any
    condition: Condition
    paramsIndex?: number
    paramsDecimals?: number
    constant?: number
}

export type HandlerOnchainEventUpdate = Partial<HandlerOnchainEventRawConfig>

export type HandlerOnchainEventRawResponse = {
    id: number
    created_at: string
    address: string
    event: string
    abi: any
    paramsIndex: number
    paramsDecimals: number
    condition: Condition
    constant: number
}

export type HandlerOnchainEventRawUpdate = {
    address?: string
    event?: string
    abi?: any
    paramsIndex?: number
    paramsDecimals?: number
    constant?: number
}

export class HandlerOnchainEvent {
	public static SimpleToRaw(name: string, network: Network, config: OnchainEventV1): TriggerRawConfig {		
		return {
			alertType: 'event', // doesn't matter, deprecated
			network,
			nickname: name,
			type: HANDLER_ONCHAIN_EVENT_V1_RAW_ID,
			handler: config
		}
	}
}