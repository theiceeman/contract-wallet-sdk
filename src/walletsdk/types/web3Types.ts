export type Web3InstanceProp = {
    provider_?: string;
    chain: string;
    testnet?: boolean;
}

export enum CONTRACT_TYPE {
    FACTORY,
    ADDRESS,
}

export type DeployErc20Clone = {
    raw?: any;
    contractAddress: string;
    callerAddress: string;
    hash?: string | any;
    rawData: any;
    nonce: number;
    fee: { fee: string, gasLimit: string, gasPrice: string }

}
export type DeployTrc20Clone = {
    raw?: any;
    contractAddress: string;
    callerAddress: string;
    hash?: string | any;
    rawData: any;
    bandwidth:number

}

