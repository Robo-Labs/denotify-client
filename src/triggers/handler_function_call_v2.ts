import { FunctionCallerConfig } from "../functionbuilder"
import { Condition } from "../types/types"
import { FilterConfig } from "../util/filter"
import { Network, TriggerRawConfig } from "./trigger"

type TimeBase = 'blocks' | 'time'
const HANDLER_FUNCTION_CALL_V2_RAW_ID = 'handler_function_call_v2'

/**
 * @typedef PollFunction
 * @param {TimeBase} timeBase - Supports two poll period types. 'block' will test the trigger ever nBlocks blocks, 'time' will test the trigger as specified by timePeriod
 * @param {number} nBlocks - 
 * 
 */
export type PollFunctionV2 = {
	// Poll period configuration
	timeBase: TimeBase
	nBlocks?: number
	timePeriod?: string | null // Grafana style time format
	startTime?: number // Start time to start the trigger, and the reference point. If 0, it'll be ignored

	// Debouncing. Default is 0
	debounceCount?: number

	// Functions
	functions: FunctionCallerConfig
	
	// Trigger
	triggerOn: 'always' | 'filter'
	latch?: boolean // If triggerOn = 'always' latch must be false.

	// Filter
	filterVersion?: string
	filter?: FilterConfig
}

export type HandlerFunctionCallV2RawConfig = {
	// Poll period configuration
	timeBase: TimeBase
	nBlocks?: number
	timePeriod?: string | null // Grafana style time format
	startTime?: number // Start time to start the trigger, and the reference point. If 0, it'll be ignored

	// Debouncing. Default is 0
	debounceCount?: number

	// Functions
	functions: FunctionCallerConfig
	
	// Trigger
	triggerOn: 'always' | 'filter'
	latch?: boolean // If triggerOn = 'always' latch must be false.

	// Filter
	filterVersion?: string
	filter?: FilterConfig
}


export type HandlerFunctionCallV2Update = Partial<HandlerFunctionCallV2RawConfig>

export type HandlerFunctionCallV2RawResponse = {
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

export type HandlerFunctionCallV2RawUpdate = {
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

export class HandlerFunctionCallV2 {
	public static SimpleToRaw(name: string, network: Network, config: PollFunctionV2): TriggerRawConfig {		
		return {
			alertType: 'event', // doesn't matter, deprecated
			network,
			nickname: name,
			type: HANDLER_FUNCTION_CALL_V2_RAW_ID,
			handler: config
		}
	}
}