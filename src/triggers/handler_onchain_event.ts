import { Condition } from "../util/filter.js"

export type OnchainEventV1 = {
	// TODO
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