export declare class Wallet {
    provider: any;
    private chain;
    private privateKey?;
    constructor(netType: string, chain: string, providerUrl?: string, apiKey?: string, privateKey?: string);
    calculateGasFee(gasPrice: string, gasLimit: string): string;
    send(tx: any): Promise<any>;
    private _sendEvmTransaction;
    private _sendTronTransaction;
}
