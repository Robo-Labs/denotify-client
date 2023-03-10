import { ethers } from "ethers";
import { DeNotifyClient } from "./denotifyclient.js";
import * as yup from "yup";

export type FunctionCallerConfig = {
  address: string;
  bytecode: string; // encoded function data
  abiHash: string;
  function: string;
}[];

export class FunctionBuilder {
  private data: FunctionCallerConfig = [];
  private constructor(private api?: DeNotifyClient) {}

  public static create(api?: DeNotifyClient) {
    return new FunctionBuilder(api);
  }

  public getAbiHash(abi: any): Promise<string> {
    if (this.api === undefined) {
      throw new Error("FunctionBuilder must be initialised with api");
    }

    return this.api.getAbiHash(abi);
  }

  public async addFunction<T = any>(
    address: string,
    func: string,
    args: T[],
    abi: any
  ) {
    const contract = new ethers.Contract(address, abi);
    contract.interface.encodeFunctionData(func, args);
    this.data.push({
      address,
      bytecode: contract.interface.encodeFunctionData(func, args),
      abiHash: await this.getAbiHash(abi),
      function: func,
    });
    return this;
  }

  public get() {
    return this.data;
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
        function: yup.string().required(),
      })
    );
  }
}
