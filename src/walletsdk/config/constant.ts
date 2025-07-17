
export enum TestnetTypes {
  TESTNET_TYPE = "ethereum-rinkeby",
}

export enum networks {
  testnet,
  mainet,
}

export enum AvailableChains {
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
  ARBITRUM = "ARBITRUM",
}

export const NativeAssets = {
  [AvailableChains.ETHEREUM]: "ETH",
  [AvailableChains.POLYGON]: "MATIC",
  [AvailableChains.TRON]: "TRON",
  [AvailableChains.CELO]: "CELO",
  [AvailableChains.BINANCE_CHAIN]: "BNB",
  [AvailableChains.BSC]: "BSC",
  [AvailableChains.BITCOIN]: "BTC",
  [AvailableChains.LITECOIN]: "LITECOIN",
  [AvailableChains.BITCOINCASH]: "BCH",
  [AvailableChains.XDC]: "XDC",
  [AvailableChains.STELLAR]: "XLM",
  [AvailableChains.SOLANA]: "SOL",
  [AvailableChains.RIPPLE]: "XRP",
  [AvailableChains.BASE]: "ETH",
  [AvailableChains.ARBITRUM]: "ETH",
};

export const Chains = {
  BTC: AvailableChains.BITCOIN,
  USDT: AvailableChains.ETHEREUM,
  DAI: AvailableChains.ETHEREUM,
  WBTC: AvailableChains.ETHEREUM,
  LEO: AvailableChains.ETHEREUM,
  LINK: AvailableChains.ETHEREUM,
  UNI: AvailableChains.ETHEREUM,
  FREE: AvailableChains.ETHEREUM,
  MKR: AvailableChains.ETHEREUM,
  USDC: AvailableChains.ETHEREUM,
  EUROC: AvailableChains.ETHEREUM,
  BAT: AvailableChains.ETHEREUM,
  TUSD: AvailableChains.ETHEREUM,
  BUSD: AvailableChains.ETHEREUM,
  PAX: AvailableChains.ETHEREUM,
  PAXG: AvailableChains.ETHEREUM,
  PLTC: AvailableChains.ETHEREUM,
  XCON: AvailableChains.ETHEREUM,
  ETH: AvailableChains.ETHEREUM,
  BSC: AvailableChains.BSC,
  BETH: AvailableChains.ETHEREUM,
  CAKE: AvailableChains.ETHEREUM,
  HAG: AvailableChains.ETHEREUM,
  BUSD_BSC: AvailableChains.BSC,
  QDX: AvailableChains.BSC,
  USDC_BSC: AvailableChains.BSC,
  BBTC: AvailableChains.ETHEREUM,
  BADA: AvailableChains.ETHEREUM,
  WBNB: AvailableChains.ETHEREUM,
  BDOT: AvailableChains.ETHEREUM,
  BXRP: AvailableChains.ETHEREUM,
  BLTC: AvailableChains.ETHEREUM,
  BBCH: AvailableChains.ETHEREUM,
  MMY: AvailableChains.ETHEREUM,
  DOGE: AvailableChains.DOGECOIN,
  LTC: AvailableChains.LITECOIN,
  BCH: AvailableChains.BITCOINCASH,
  TRON: AvailableChains.TRON,
  USDT_TRON: AvailableChains.TRON,
  FLOW: AvailableChains.FLOW,
  FUSD: AvailableChains.FLOW,
  CELO: AvailableChains.CELO,
  CEUR: AvailableChains.CELO,
  CUSD: AvailableChains.CELO,
  XDC: AvailableChains.XDC,
  XRP: AvailableChains.RIPPLE,
  XLM: AvailableChains.STELLAR,
  USDC_XLM: AvailableChains.STELLAR,
  TUSDC_XLM: AvailableChains.STELLAR,
  VET: AvailableChains.VET,
  NEO: AvailableChains.NEO,
  BNB: AvailableChains.BINANCE_CHAIN,
  LYRA: AvailableChains.LYRA,
  ADA: AvailableChains.ADA,
  MATIC: AvailableChains.POLYGON,
  USDC_MATIC: AvailableChains.POLYGON,
  TUSDC_MATIC: AvailableChains.POLYGON,
  TUSDC_ETH: AvailableChains.ETHEREUM,
  USDT_MATIC: AvailableChains.POLYGON,
  SOL: AvailableChains.SOLANA,
  BASE: AvailableChains.BASE,
  ARBITRUM: AvailableChains.ARBITRUM,
};

export const CUSTODIAL_GENESIS_ADDRESS_CONTRACT: custodialAddressRegistryType =
  {
    testnet: {
      [AvailableChains.ETHEREUM]: "",
      [AvailableChains.POLYGON]: "",
      [AvailableChains.BSC]: "",
      [AvailableChains.TRON]: "",
      [AvailableChains.BASE]: "0xc7cB2efBa34EfE32AC990392945B8bEC5E78A4d8",
      [AvailableChains.ARBITRUM]: "",
    },
    mainnet: {
      [AvailableChains.ETHEREUM]: "",
      [AvailableChains.POLYGON]: "",
      [AvailableChains.BSC]: "",
      [AvailableChains.TRON]: "",
      [AvailableChains.BASE]: "",
      [AvailableChains.ARBITRUM]: "",
    },
  };

export type custodialAddressRegistryType = {
  [key: string]: {
    [key: string]: string;
  };
};

export const CUSTODIAL_ADDRESS_FACTORY_CONTRACT: custodialAddressRegistryType =
  {
    testnet: {
      [AvailableChains.ETHEREUM]: "", // sepolia
      [AvailableChains.POLYGON]: "",  // polygon-mumbai
      [AvailableChains.BSC]: "",  // bscscam
      [AvailableChains.TRON]: "", // nile or shasta
      [AvailableChains.BASE]: "0xA366b936b6eCD03f5da29794cd6BCaCc43C60d46", // base-sepolia
      [AvailableChains.ARBITRUM]: "", // arb-sepolia
    },
    mainnet: {
      [AvailableChains.ETHEREUM]: "",
      [AvailableChains.POLYGON]: "",
      [AvailableChains.BSC]: "",
      [AvailableChains.TRON]: "",
      [AvailableChains.BASE]: "",
      [AvailableChains.ARBITRUM]: "",
    },
  };
