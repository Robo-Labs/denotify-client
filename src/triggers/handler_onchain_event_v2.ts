import { FunctionBuilder, FunctionCallerConfig } from '../functionbuilder.js'
import { FilterBuilder, FilterConfig } from '../util/filter.js'
import {
	FieldDescription,
	HandlerRawConfig,
	Network,
	TriggerRawConfig
} from './trigger.js'
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
	functions: FunctionCallerConfig[] | null

	// Trigger
	triggerOn?: 'always' | 'filter' // Default = 'always'
	latch?: boolean // If triggerOn = 'always' latch must be false.

	// Filter
	filterVersion: string | null
	filter: FilterConfig | null
}

export type HandlerOnchainEventV2RawConfig = {
	// Event Trigger
	addresses: string[]
	abiHash: string
	event: string

	// Debouncing. Default is 0
	debounceCount?: number

	// Functions
	functions: FunctionCallerConfig[] | null

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
	functions: FunctionCallerConfig[] | null
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
	functions: FunctionCallerConfig[] | null
	triggerOn: 'always' | 'filter'
	latch: boolean // If triggerOn = 'always' latch must be false.
	filterVersion: string | null
	filter: FilterConfig | null
}

const schema = yup.object({
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

const solidityToTypescriptType = (type: string) => {
	return type
}

type Input = {
	name: string
	type: string
	indexed: boolean
	internalType: string
	components?: Input[]
}

const flattenFields = (
	inputs: Input[],
	source: string,
	fields: FieldDescription[] = [],
	keyPrefix = '',
	labelPrefix = ''
) => {
	inputs.forEach((input, index) => {
		const isArray = input.type.includes('[')
		const array = isArray ? '_[]' : ''
		if (input.components) {
			const id = input.name === '' ? `${index}` : input.name
			flattenFields(
				input.components,
				source,
				fields,
				`${keyPrefix}${index}${array}_`,
				`${id}${isArray ? '[]' : ''}.`
			)
		} else {
			fields.push({
				source,
				label: `${labelPrefix}${input.name}`,
				type: solidityToTypescriptType(input.type),
				key: `${keyPrefix}${index}${array}`,
				index
			})
		}
	})
	return fields
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
			handler: await this.validate(config)
		}
	}

	public static validate(options: Partial<OnchainEventV2>): HandlerRawConfig {
		return schema.validateSync(options)
	}

	public static readFields(
		trigger: Partial<OnchainEventV2>,
		abis: { [key: string]: any }
	): FieldDescription[] {
		let fields: FieldDescription[] = [
			/* eslint-disable */
			{ source: 'defaults', label: 'Network', type: 'string', key: 'network' },
			{ source: 'defaults', label: 'Timestamp', type: 'number', key: 'timestamp' },
			{ source: 'defaults', label: 'Time GMT', type: 'string', key: 'timeStringGMT' },
			{ source: 'defaults', label: 'Block', type: 'number', key: 'block' },
			{ source: 'defaults', label: 'Time Period', type: 'string', key: 'timePeriod' },
			{ source: 'defaults', label: 'Block Hash', type: 'string', key: 'blockHash' },
			{ source: 'defaults', label: 'Transaction Hash', type: 'string', key: 'txHash' },
			{ source: 'defaults', label: 'Event', type: 'string', key: 'event' },
			/* eslint-enable */
		]
		if (!trigger.abiHash)
			throw new Error('abiHash is required for onchain event v2')

		if (!abis[trigger.abiHash])
			throw new Error('ABI for hash not found in abis')

		const event = abis[trigger.abiHash].find(
			(e: any) => e.name === trigger.event
		)
		fields = flattenFields(
			event.inputs,
			`${trigger.event} Event`,
			fields,
			'param_'
		)

		if (!trigger.functions) return fields
		// order the abis
		const orderedAbis = trigger.functions.map(e => abis[e.abiHash])
		return [
			...FunctionBuilder.readFields(trigger.functions, orderedAbis),
			...fields
		]
	}
}
