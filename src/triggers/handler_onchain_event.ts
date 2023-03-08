import { Network, TriggerRawConfig } from "./trigger.js"
import { Condition } from "../types/types.js"
import * as yup from 'yup'

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

	public static validateCreate(options: any) {
		const requiredWhenConditional = ([condition]: string[], schema: any) =>  condition === 'true' ? schema.notRequired() : schema.required()

		const onchainEventSchema = yup.object({
			address: yup.string().required(),
			event: yup.string().required(), // TODO check event is in abi
			abi: yup.array().required(),
			condition: yup.string().oneOf(['>', '>=', '<', '<=', '=', 'true']),
			constant: yup.number().min(0).when('condition', requiredWhenConditional),
			paramsIndex: yup.number().min(0).when('condition', requiredWhenConditional), // TODO check paramsIndex exists in ABI
			paramsDecimals: yup.number().min(0).when('condition', requiredWhenConditional),
		})
		return onchainEventSchema.validate(options)
	}

	public static validateUpdate(options: any) {
	}
}