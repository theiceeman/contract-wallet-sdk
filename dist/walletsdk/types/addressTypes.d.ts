export declare enum Currency {
    BTC = "BTC",
    BCH = "BCH",
    LTC = "LTC",
    CELO = "CELO",
    ONE = "ONE",
    CUSD = "CUSD",
    CEUR = "CEUR",
    LUNA = "LUNA",
    LUNA_KRW = "LUNA_KRW",
    LUNA_USD = "LUNA_USD",
    ETH = "ETH",
    FABRIC = "FABRIC",
    QUORUM = "QUORUM",
    XRP = "XRP",
    XLM = "XLM",
    XBN = "XBN",
    USDC_XLM = "USDC_XLM",
    TUSDC_XLM = "TUSDC_XLM",
    DOGE = "DOGE",
    VET = "VET",
    NEO = "NEO",
    BNB = "BNB",
    BSC = "BSC",
    CAKE = "CAKE",
    BUSD_BSC = "BUSD_BSC",
    B2U_BSC = "B2U_BSC",
    BETH = "BETH",
    GAMEE = "GAMEE",
    BBTC = "BBTC",
    BADA = "BADA",
    RMD = "RMD",
    WBNB = "WBNB",
    BDOT = "BDOT",
    BXRP = "BXRP",
    BLTC = "BLTC",
    BBCH = "BBCH",
    MATIC = "MATIC",
    USDC_MATIC = "USDC_MATIC",
    USDC_BSC = "USDC_BSC",
    USDT = "USDT",
    GMC = "GMC",
    GMC_BSC = "GMC_BSC",
    FLOW = "FLOW",
    FUSD = "FUSD",
    USDT_TRON = "USDT_TRON",
    INRT_TRON = "INRT_TRON",
    TRON = "TRON",
    LEO = "LEO",
    LINK = "LINK",
    WBTC = "WBTC",
    UNI = "UNI",
    FREE = "FREE",
    MKR = "MKR",
    USDC = "USDC",
    MATIC_ETH = "MATIC_ETH",
    BAT = "BAT",
    TUSD = "TUSD",
    BUSD = "BUSD",
    PAX = "PAX",
    PLTC = "PLTC",
    XCON = "XCON",
    REVV = "REVV",
    SAND = "SAND",
    MMY = "MMY",
    PAXG = "PAXG",
    HAG = "HAG",
    LYRA = "LYRA",
    ADA = "ADA",
    XDC = "XDC",
    LATOKEN = "LATOKEN",
    USDT_MATIC = "USDT_MATIC",
    TUSDC_MATIC = "TUSDC_MATIC",
    SOL = "SOL",
    QTUM = "QTUM",
    EGLD = "EGLD",
    ALGO = "ALGO"
}
export { Currency as Assets };
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
    ADA = "ADA"
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
    USDT_MATIC: AvailableChains;
    SOL: AvailableChains;
};
export declare const CUSTODIAL_GENESIS_ADDRESS_CONTRACT: {
    testnet: {
        ETHEREUM: string;
        POLYGON: string;
        BSC: string;
    };
    mainnet: {
        ETHEREUM: string;
        POLYGON: string;
        BSC: string;
    };
};
export declare const CUSTODIAL_ADDRESS_FACTORY_CONTRACT: {
    testnet: {
        ETHEREUM: string;
        POLYGON: string;
        BSC: string;
    };
    mainnet: {
        ETHEREUM: string;
        POLYGON: string;
        BSC: string;
    };
};
