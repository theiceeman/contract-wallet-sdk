import { TestnetTypes } from "../config/constant"

export type initializeProp = {
    testnetType?: TestnetTypes,
    blockchainType: supportedBlockchainsTypes
}

export enum supportedBlockchainsTypes {
    EVM = 'EVM',
    TVM = 'TVM'
}