import { Condition } from "../types/types.js"
import { Network, TriggerRawConfig } from "./trigger.js"

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
    id: number,
    created_at: string,
    nBlocks: number,
    address: string,
    fixedArgs: string[],
    responseArgIndex: number,
    responseArgDecimals: number,
    function: string,
    condition: Condition,
    constant: number,
    abi: string[],
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
	public static SimpleToRaw(name: string, network: Network, config: PollFunctionV1): TriggerRawConfig {		
		return {
			alertType: 'event', // doesn't matter, deprecated
			network,
			nickname: name,
			type: HANDLER_FUNCTION_CALL_V1_RAW_ID,
			handler: config
		}
	}
}