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

export type HandlerFunctionCallV2Update =
	Partial<HandlerFunctionCallV2RawConfig>

export type HandlerFunctionCallV2RawResponse = {
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
			handler: (await HandlerFunctionCallV2.convertAndValidate(
				config
			)) as HandlerRawConfig
		}
	}

	public static async convertAndValidate(
		options: PollFunctionV2
	): Promise<HandlerFunctionCallV2RawConfig> {
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
				),
			filter: FilterBuilder.schema().when('triggerOn', ([triggerOn], schema) =>
				triggerOn === 'filter'
					? schema.required()
					: schema.nullable().default(null)
			)
		})

		return schema.validate(options)
	}
}
