import { Condition } from '../types/types.js'
import { HandlerRawConfig, Network, TriggerRawConfig } from './trigger.js'
import * as yup from 'yup'

const HANDLER_FUNCTION_CALL_V1_RAW_ID = 'handler_function_call'

export type PollFunctionV1 = {
	nBlocks: number
	address: string
	abi: any
	fixedArgs?: (string | number)[]
	function: string
	condition: Condition
	responseArgIndex?: number
	responseArgDecimals?: number
	constant?: number
}

export type HandlerFunctionCallRawConfig = {
	nBlocks: number
	address: string
	abi: any
	fixedArgs?: (string | number)[]
	function: string
	condition: Condition
	responseArgIndex?: number
	responseArgDecimals?: number
	constant?: number
}

export type HandlerFunctionCallUpdate = Partial<HandlerFunctionCallRawConfig>

export type HandlerFunctionCallRawResponse = {
	id: number
	created_at: string
	nBlocks: number
	address: string
	fixedArgs: string[]
	responseArgIndex: number
	responseArgDecimals: number
	function: string
	condition: Condition
	constant: number
	abi: string[]
	version: number
}

export type HandlerFunctionCallRawUpdate = {
	address?: string
	function?: string
	abi?: any
	constant?: number
	nBlocks?: number
	confition?: Condition
	fixedArgs?: (string | number)[]
	responseArgIndex?: number
	responseArgDecimals?: number
}

export class HandlerFunctionCall {
	public static async SimpleToRaw(
		name: string,
		network: Network,
		config: PollFunctionV1
	): Promise<TriggerRawConfig> {
		return {
			alertType: 'event', // doesn't matter, deprecated
			network,
			nickname: name,
			type: HANDLER_FUNCTION_CALL_V1_RAW_ID,
			handler: await this.validate(config)
		}
	}

	public static validate(options: Partial<PollFunctionV1>): HandlerRawConfig {
		const requiredWhenConditional = ([condition]: string[], schema: any) =>
			condition === 'true' ? schema.notRequired() : schema.required()

		const schema = yup.object({
			address: yup.string().required(),
			abi: yup.array().required(),
			nBlocks: yup.number().default(100).min(10).required(),
			function: yup.string().required(),
			condition: yup
				.string()
				.default('true')
				.oneOf(['>', '>=', '<', '<=', '=', 'true'])
				.required(),
			constant: yup.number().min(0).when('condition', requiredWhenConditional),
			responseArgIndex: yup
				.number()
				.min(0)
				.when('condition', requiredWhenConditional),
			responseArgDecimals: yup
				.number()
				.min(0)
				.when('condition', requiredWhenConditional)
		})
		return schema.validateSync(options)
	}
}
