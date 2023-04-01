import { FunctionBuilder, FunctionCallerConfig } from '../functionbuilder.js'
import { FilterBuilder, FilterConfig } from '../util/filter.js'
import {
	FieldDescription,
	HandlerRawConfig,
	Network,
	TriggerRawConfig
} from './trigger.js'
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
	functions: FunctionCallerConfig[] | null

	// Trigger
	triggerOn: 'always' | 'filter'
	latch?: boolean // If triggerOn = 'always' latch must be false.

	// Filter
	filterVersion: string | null
	filter: FilterConfig | null
}

export type HandlerFunctionCallV2RawConfig = PollFunctionV2
export type HandlerFunctionCallV2Update = Partial<PollFunctionV2>

export type HandlerFunctionCallV2RawResponse = PollFunctionV2 & {
	id: number
	created_at: string
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
	filter: FilterBuilder.schema()
		.when('triggerOn', ([triggerOn], schema) =>
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

	public static readFields(
		trigger: PollFunctionV2,
		abis: { [key: string]: any }
	): FieldDescription[] {
		const defaults: FieldDescription[] = [
			/* eslint-disable */
			{ source: 'defaults', label: 'Network', type: 'string', key: 'network' },
			{
				source: 'defaults',
				label: 'Timestamp',
				type: 'number',
				key: 'timestamp'
			},
			{
				source: 'defaults',
				label: 'Time GMT',
				type: 'number',
				key: 'timeStringGMT'
			},
			{ source: 'defaults', label: 'Block', type: 'number', key: 'block' },
			{
				source: 'defaults',
				label: 'Time Period',
				type: 'number',
				key: 'timePeriod'
			}
			/* eslint-enable */
		]

		if (!trigger.functions) return defaults
		// order the abis
		const orderedAbis = trigger.functions.map(e => abis[e.abiHash])
		console.log(orderedAbis)
		return [
			...FunctionBuilder.readFields(trigger.functions, orderedAbis),
			...defaults
		]
	}
}
