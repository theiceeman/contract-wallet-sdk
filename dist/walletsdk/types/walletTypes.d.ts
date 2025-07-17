import { TestnetTypes } from "../config/constant";
export type initializeProp = {
    testnetType?: TestnetTypes;
    blockchainType: supportedBlockchainsTypes;
};
export declare enum supportedBlockchainsTypes {
    EVM = "EVM",
    TVM = "TVM"
}
