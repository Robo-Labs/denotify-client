import { FunctionBuilder, FunctionCallerConfig } from '../functionbuilder.js'
import { Condition } from '../types/types.js'
import { FilterBuilder, FilterConfig } from '../util/filter.js'
import { HandlerRawConfig, Network, TriggerRawConfig } from './trigger.js'
import * as yup from 'yup'

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
	functions: FunctionCallerConfig | null

	// Trigger
	triggerOn: 'always' | 'filter'
	latch?: boolean // If triggerOn = 'always' latch must be false.

	// Filter
	filterVersion: string | null
	filter: FilterConfig | null
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
	functions: FunctionCallerConfig | null

	// Trigger
	triggerOn: 'always' | 'filter'
	latch?: boolean // If triggerOn = 'always' latch must be false.

	// Filter
	filterVersion: string | null
	filter: FilterConfig | null
}

export type HandlerFunctionCallV2Update =
	Partial<HandlerFunctionCallV2RawConfig>

export type HandlerFunctionCallV2RawResponse = {
	id: number
	created_at: string
	// Poll period configuration
	timeBase: TimeBase
	nBlocks?: number
	timePeriod?: string | null // Grafana style time format
	startTime?: number // Start time to start the trigger, and the reference point. If 0, it'll be ignored
	debounceCount?: number
	functions: FunctionCallerConfig | null
	triggerOn: 'always' | 'filter'
	latch?: boolean // If triggerOn = 'always' latch must be false.
	filterVersion: string | null
	filter: FilterConfig | null
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

const timePeriodRegex = /^(\d+)([SMHD])$/i
const schema = yup.object({
	timeBase: yup.string().oneOf(['blocks', 'time']).required(),
	nBlocks: yup
		.number()
		.min(10)
		.when('timeBase', ([timeBase], schema) =>
			timeBase === 'blocks' ? schema.required() : schema
		),
	timePeriod: yup
		.string()
		.matches(
			timePeriodRegex,
			'timePeriod must be of the format n[s|m|h|d], eg 10s for 10 seconds'
		)
		.when('timeBase', ([timeBase], schema) =>
			timeBase === 'time' ? schema.required() : schema
		),
	startTime: yup.number().default(0),
	debounceCount: yup.number().default(0),
	functions: FunctionBuilder.schema().required(),
	triggerOn: yup.string().oneOf(['always', 'filter']).default('always'),
	latch: yup.boolean().default(false),
	filterVersion: yup
		.string()
		.when('triggerOn', ([triggerOn], schema) =>
			triggerOn === 'filter'
				? schema.default('0')
				: schema.nullable().default(null)
		)
		.required(),
	filter: FilterBuilder.schema().when('triggerOn', ([triggerOn], schema) =>
			triggerOn === 'filter'
				? schema.required()
				: schema.nullable().default(null)
		)
		.required()
})

export class HandlerFunctionCallV2 {
	public static async SimpleToRaw(
		name: string,
		network: Network,
		config: PollFunctionV2
	): Promise<TriggerRawConfig> {
		return {
			alertType: 'event', // doesn't matter, deprecated
			network,
			nickname: name,
			type: HANDLER_FUNCTION_CALL_V2_RAW_ID,
			handler: await this.validate(config)
		}
	}

	public static validate(options: Partial<PollFunctionV2>): HandlerRawConfig {
		return schema.validateSync(options)
	}

	public static async convertFromPartial(
		options: Partial<PollFunctionV2>
	): Promise<PollFunctionV2> {
		return schema.validate(options)
	}
}
