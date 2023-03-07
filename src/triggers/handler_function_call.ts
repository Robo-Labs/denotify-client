import { Condition } from "../types/types"


export type PollFunctionV1 = {
	// TODO
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