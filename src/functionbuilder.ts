import { ethers } from 'ethers'
import { DeNotifyClient } from './denotifyclient.js'
import * as yup from 'yup'

export type FunctionCallerConfig = {
	address: string
	bytecode: string // encoded function data
	abiHash: string
	function: string
}

export class FunctionBuilder {
	private data: FunctionCallerConfig[] = []
	private constructor(private api?: DeNotifyClient) {}

	public static create(api?: DeNotifyClient) {
		return new FunctionBuilder(api)
	}

	public getAbiHash(abi: any): Promise<string> {
		if (this.api === undefined) {
			throw new Error('FunctionBuilder must be initialised with api')
		}

		return this.api.getAbiHash(abi)
	}

	public static readFields(data: FunctionCallerConfig[], abis: any[][]) {
		if (data.length === 0) {
			return []
		}

		const getFieldsForFunction = (config: FunctionCallerConfig, i: number) => {
			console.log(abis)
			const func = abis[i].find(e => e.name === config.function)
			if (!func) throw new Error('function not in ABI')

			return func.outputs.map((e: any, index: number) => {
				return {
					source: `function:${config.function}:${i}`,
					name: e.name,
					type: e.type,
					key: `func_${i}_ret_${index}`,
					index
				}
			})
		}

		return data.map((config: FunctionCallerConfig, index: number) =>
			getFieldsForFunction(config, index)
		)
	}

	public async addFunction<T = any>(
		address: string,
		func: string,
		args: T[],
		abi: any,
		abiHash?: string
	) {
		console.log(abiHash)
		const contract = new ethers.Contract(address, abi)
		contract.interface.encodeFunctionData(func, args)
		abiHash = abiHash || (await this.getAbiHash(abi))
		console.log(abiHash)
		this.data.push({
			address,
			bytecode: contract.interface.encodeFunctionData(func, args),
			abiHash,
			function: func
		})
		return this
	}

	public get() {
		return this.data
	}

	public static schema() {
		return yup.array().of(
			yup.object({
				address: yup.string().required(),
				bytecode: yup
					.string()
					.matches(/^(0x)?([0-9a-fA-F]{2})*$/)
					.required(),
				abiHash: yup
					.string()
					.matches(/^[A-Fa-f0-9]{64}/)
					.required(),
				function: yup.string().required()
			})
		)
	}
}
