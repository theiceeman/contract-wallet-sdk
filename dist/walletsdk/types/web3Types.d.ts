export type Web3InstanceProp = {
    provider_?: string;
    chain: string;
    testnet?: boolean;
};
export declare enum CONTRACT_TYPE {
    FACTORY = 0,
    ADDRESS = 1
}
export type DeployErc20Clone = {
    raw?: any;
    contractAddress: string;
    callerAddress: string;
    hash?: string | any;
    rawData: any;
    nonce: number;
    fee: {
        fee: string;
        gasLimit: string;
        gasPrice: string;
    };
};
export type DeployTrc20Clone = {
    raw?: any;
    contractAddress: string;
    callerAddress: string;
    hash?: string | any;
    rawData: any;
    bandwidth: number;
};
