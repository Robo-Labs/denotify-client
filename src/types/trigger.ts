import { FilterConfig } from "../util/filter"

export type FunctionCallerConfig = {
	address: string
	bytecode: string // encoded function data
	abiHash: string
	function: string
}[]

export type TriggerTypeId = 'PollFunctionV2' | 'OnchainEventV2' | 'FunctionEventV2'
type TimeBase = 'blocks' | 'time'
/**
 * @typedef PollFunction
 * @param {TimeBase} timeBase - Supports two poll period types. 'block' will test the trigger ever nBlocks blocks, 'time' will test the trigger as specified by timePeriod
 * @param {number} nBlocks - 
 * 
 */
export type PollFunction = {
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

export type TriggerType = PollFunction