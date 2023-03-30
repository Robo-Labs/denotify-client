import { FunctionBuilder, FunctionCallerConfig } from '../functionbuilder.js'
import { FilterBuilder, FilterConfig } from '../util/filter.js'
import { HandlerRawConfig, Network, TriggerRawConfig } from './trigger.js'
import * as yup from 'yup'

const HANDLER_ONCHAIN_EVENT_V2_RAW_ID = 'handler_onchain_event_v2'

export type OnchainEventV2 = {
	// Event Trigger
	addresses: string[]
	abiHash: string
	event: string

	// Poll period configuration
	// Debouncing. Default is 0
	debounceCount?: number

	// Functions
	functions?: FunctionCallerConfig

	// Trigger
	triggerOn?: 'always' | 'filter' // Default = 'always'
	latch?: boolean // If triggerOn = 'always' latch must be false.

	// Filter
	filterVersion?: string
	filter?: FilterConfig
}

export type HandlerOnchainEventV2RawConfig = {
	// Event Trigger
	addresses: string[]
	abiHash: string
	event: string

	// Debouncing. Default is 0
	debounceCount?: number

	// Functions
	functions: FunctionCallerConfig | null

	// Trigger
	triggerOn: 'always' | 'filter'
	latch: boolean // If triggerOn = 'always' latch must be false.

	// Filter
	filterVersion: string | null
	filter: FilterConfig | null
}

export type HandlerOnchainEventV2Update =
	Partial<HandlerOnchainEventV2RawConfig>

export type HandlerOnchainEventV2RawResponse = {
	id: number
	created_at: string
	addresses: string[]
	abiHash: string
	event: string
	debounceCount?: number
	functions: FunctionCallerConfig | null
	triggerOn: 'always' | 'filter'
	latch: boolean // If triggerOn = 'always' latch must be false.
	filterVersion: string | null
	filter: FilterConfig | null
}

export type HandlerOnchainEventV2RawUpdate = {
	addresses: string[]
	abiHash: string
	event: string
	debounceCount?: number
	functions: FunctionCallerConfig | null
	triggerOn: 'always' | 'filter'
	latch: boolean // If triggerOn = 'always' latch must be false.
	filterVersion: string | null
	filter: FilterConfig | null
}

export class HandlerOnchainEventV2 {
	public static async SimpleToRaw(
		name: string,
		network: Network,
		config: OnchainEventV2
	): Promise<TriggerRawConfig> {
		return {
			alertType: 'event', // doesn't matter, deprecated
			network,
			nickname: name,
			type: HANDLER_ONCHAIN_EVENT_V2_RAW_ID,
			handler: (await HandlerOnchainEventV2.convertAndValidate(
				config
			)) as HandlerRawConfig
		}
	}

	public static async convertAndValidate(
		options: OnchainEventV2
	): Promise<HandlerOnchainEventV2RawConfig> {
		const onchainEventSchema = yup.object({
			addresses: yup.array().of(yup.string().required()).required(),
			abiHash: yup.string().required(),
			event: yup.string().required(),
			debounceCount: yup.number().default(0),
			functions: FunctionBuilder.schema().nullable().default(null),
			triggerOn: yup.string().oneOf(['always', 'filter']).default('always'),
			latch: yup.boolean().default(false),
			filterVersion: yup.string().nullable().default(null),
			filter: FilterBuilder.schema()
				.when('triggerOn', ([triggerOn], schema) =>
					triggerOn === 'filter' ? schema : schema.nullable().default(null)
				)
				.required()
		})

		return onchainEventSchema.validate(options)
	}
}
