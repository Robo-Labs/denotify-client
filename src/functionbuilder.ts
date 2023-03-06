import { ethers } from "ethers"
import { DeNotifyClient } from "./client"
import { FunctionCallerConfig } from "./types/trigger"


export class FunctionBuilder {
	private data: FunctionCallerConfig = []
	private constructor(private api?: DeNotifyClient) {}

	public static create(api?: DeNotifyClient) {
		return new FunctionBuilder(api)
	}

	public getAbiHash(abi: any): Promise<string> {
		if (this.api === undefined)
			throw new Error('FunctionBuilder must be initialised with api')

		return this.api.getAbiHash(abi)
	}

	public async addFunction<T = any>(address: string, func: string, args: T[], abi: any) {
		const contract = new ethers.Contract(address, abi)
		contract.interface.encodeFunctionData(func, args)
		this.data.push({
			address,
			bytecode: contract.interface.encodeFunctionData(func, args),
			abiHash: await this.getAbiHash(abi),
			function: func,			
		})
		return this
	}

	public get() {
		return this.data
	}

}