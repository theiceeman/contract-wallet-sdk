export declare enum EvmChain {
    ETHEREUM = "ethereum",
    POLYGON = "polygon",
    BSC = "bsc",
    BASE = "base",
    OPTIMISM = "optimism",
    ARBITRUM = "arbitrum"
}
export declare enum TvmChain {
    TRON = "tron"
}
export declare enum NetTypes {
    MAIN = "mainnet",
    TEST = "testnet"
}
export type TokenTypes = 'ERC20' | 'ERC721' | 'ERC1155' | 'TRC20' | 'TRC10';
export interface Wallet {
    address: string;
    publicKey?: string;
    privateKey?: string;
    mnemonic?: string;
    chain: EvmChain;
    net: NetTypes;
    [key: string]: any;
}
