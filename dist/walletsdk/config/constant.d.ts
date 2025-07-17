export declare enum TestnetTypes {
    TESTNET_TYPE = "ethereum-rinkeby"
}
export declare enum networks {
    testnet = 0,
    mainet = 1
}
export declare enum AvailableChains {
    BITCOIN = "BITCOIN",
    ETHEREUM = "ETHEREUM",
    POLYGON = "POLYGON",
    DOGECOIN = "DOGECOIN",
    LITECOIN = "LITECOIN",
    BITCOINCASH = "BITCOINCASH",
    TRON = "TRON",
    FLOW = "FLOW",
    CELO = "CELO",
    XDC = "XDC",
    RIPPLE = "RIPPLE",
    STELLAR = "STELLAR",
    SOLANA = "SOLANA",
    VET = "VET",
    NEO = "NEO",
    BINANCE_CHAIN = "BINANCE_CHAIN",
    BSC = "BSC",
    LYRA = "LYRA",
    ADA = "ADA",
    BASE = "BASE",
    ARBITRUM = "ARBITRUM"
}
export declare const NativeAssets: {
    ETHEREUM: string;
    POLYGON: string;
    TRON: string;
    CELO: string;
    BINANCE_CHAIN: string;
    BSC: string;
    BITCOIN: string;
    LITECOIN: string;
    BITCOINCASH: string;
    XDC: string;
    STELLAR: string;
    SOLANA: string;
    RIPPLE: string;
    BASE: string;
    ARBITRUM: string;
};
export declare const Chains: {
    BTC: AvailableChains;
    USDT: AvailableChains;
    DAI: AvailableChains;
    WBTC: AvailableChains;
    LEO: AvailableChains;
    LINK: AvailableChains;
    UNI: AvailableChains;
    FREE: AvailableChains;
    MKR: AvailableChains;
    USDC: AvailableChains;
    EUROC: AvailableChains;
    BAT: AvailableChains;
    TUSD: AvailableChains;
    BUSD: AvailableChains;
    PAX: AvailableChains;
    PAXG: AvailableChains;
    PLTC: AvailableChains;
    XCON: AvailableChains;
    ETH: AvailableChains;
    BSC: AvailableChains;
    BETH: AvailableChains;
    CAKE: AvailableChains;
    HAG: AvailableChains;
    BUSD_BSC: AvailableChains;
    QDX: AvailableChains;
    USDC_BSC: AvailableChains;
    BBTC: AvailableChains;
    BADA: AvailableChains;
    WBNB: AvailableChains;
    BDOT: AvailableChains;
    BXRP: AvailableChains;
    BLTC: AvailableChains;
    BBCH: AvailableChains;
    MMY: AvailableChains;
    DOGE: AvailableChains;
    LTC: AvailableChains;
    BCH: AvailableChains;
    TRON: AvailableChains;
    USDT_TRON: AvailableChains;
    FLOW: AvailableChains;
    FUSD: AvailableChains;
    CELO: AvailableChains;
    CEUR: AvailableChains;
    CUSD: AvailableChains;
    XDC: AvailableChains;
    XRP: AvailableChains;
    XLM: AvailableChains;
    USDC_XLM: AvailableChains;
    TUSDC_XLM: AvailableChains;
    VET: AvailableChains;
    NEO: AvailableChains;
    BNB: AvailableChains;
    LYRA: AvailableChains;
    ADA: AvailableChains;
    MATIC: AvailableChains;
    USDC_MATIC: AvailableChains;
    TUSDC_MATIC: AvailableChains;
    TUSDC_ETH: AvailableChains;
    USDT_MATIC: AvailableChains;
    SOL: AvailableChains;
    BASE: AvailableChains;
    ARBITRUM: AvailableChains;
};
export declare const CUSTODIAL_GENESIS_ADDRESS_CONTRACT: custodialAddressRegistryType;
export type custodialAddressRegistryType = {
    [key: string]: {
        [key: string]: string;
    };
};
export declare const CUSTODIAL_ADDRESS_FACTORY_CONTRACT: custodialAddressRegistryType;
