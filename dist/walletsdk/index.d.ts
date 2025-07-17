import { EvmChain } from './types/types';
import { changeTransferGassLimitParam, deployAddressParam, disableAutoFlushParam, enableAutoFlushParam, flushMultipleTokensParam, flushTokenParam, getBalanceParam, predictAddressParam, predictDeterministicAddressParam, transferOwnershipParam, transferParam, transferToManyParam } from "./interfaces/iAddress";
/**
 * This class uses factory contracts to clone contracts on chain
 * when deploying a new wallet and uses create2 to generate feeless,
 * on chain wallets
 */
export default class WalletSDK {
    private _chain;
    private _network;
    private _chainType;
    private _account;
    private _chainService;
    /**
     *
     * @param chain - The blockchain being connected to.
     * @param chainType - The virtual machine being connected to. This could be TVM, EVM...
     * @param network - The blockchain network type; could be testnet or mainnet.
     * @param privateKey - Private key of user to sign transactions.
     * @param publicAddress - Public key of user account to sign transactions.
     * @param addressContractAddress - Address of the genesis wallet.
     * @param deployedAddress - Address of deployed user wallet; if user has one deployed already.
     * @param provider - Pass in a custom provider to connect with.
     */
    constructor(chain: EvmChain, chainType: "evm" | "tvm", network: "testnet" | "mainnet", privateKey: string, deployedAddress?: string, addressContractAddress?: string, factoryContractAddress?: string, provider?: string, providerApiKey?: string);
    /**
     * This deploys a proxy contract to non coliding uniquely generated
     * address using a salt passed to the create2 command.
     * @param params - Parameter required for deploying a new addressWallet.
     * @returns Transaction object for the deployed contract.
     */
    deployAddress(params: deployAddressParam): Promise<any>;
    /**
     * This ensure address predicted is uniquely generated using the given salt
     * and the onwer address. This would eliminate colliding addresses.
     * @param params - Parameters required to predict a users walletAddress.
     * @returns - An address where the users walletContract will be deployed to
     */
    predictAddress(params: predictAddressParam): Promise<any>;
    predictDeterministicAddress(params: predictDeterministicAddressParam): Promise<null>;
    /**
     * This gets the balance of native and erc20 assets.
     * @param params - Parameters required to get the balance of a deployed contract wallet.
     * @returns - Returns the tokenBalance of the wallet.
     */
    getBalance(params: getBalanceParam): Promise<any>;
    /**
     * This transfers wallet ownership to another address (most cases the users address).
     * @param params
     * @returns - Returns a transaction object.
     */
    transferOwnership(params: transferOwnershipParam): Promise<any>;
    /**
     * This executes transfer of native and erc20 transaction to another address.
     * @param params
     * @returns - Returns a transaction object.
     */
    transfer(params: transferParam): Promise<any>;
    /**
     * This initiates transfer to many address at once in a single transaction.
     * You can also specify the erc20 token you want to send out.
     * @param params - Parameters required for transferring to many addresses.
     * @returns - Returns a transaction object.
     */
    transferToMany(params: transferToManyParam): Promise<any>;
    /**
     * This flushes native assets to deployer/owner address.
     * @returns - Returns a transaction object.
     */
    flush(): Promise<any>;
    /**
     * This Flushes a single erc20 tokens to a deployer/owner address.
     * @params - Parameters required for flushing a token.
     * @returns - Returns a transaction object.
     */
    flushTokens(params: flushTokenParam): Promise<any>;
    /**
     * This Flushes multiple erc20 tokens to a deployer/owner address.
     * @params - Parameters required for flushing multiple tokens.
     * @returns - Returns a transaction object.
     */
    flushMultipleTokens(params: flushMultipleTokensParam): Promise<any>;
    /**
     * This enables auto flush on incoming deposits.
     * @params - Parameters required for enabling auto flush.
     * @returns - Returns a transaction object.
     */
    enableAutoFlush(params: enableAutoFlushParam): Promise<any>;
    /**
     * This disables auto flush on incoming deposits.
     * @params - Parameters required for disabling auto flush.
     * @returns - Returns a transaction object.
     */
    disableAutoFlush(params: disableAutoFlushParam): Promise<any>;
    /**
     * This changes gas limit of on chain transfers.
     * @params - Parameters required for changing transfer gas limit.
     * @returns - Returns a transaction object.
     */
    changeTransferGasLimit(params: changeTransferGassLimitParam): Promise<any>;
    /**
     * Gets the current master address of the deployed contract wallet.
     * @returns - The master address as a string.
     */
    getMasterAddress(): Promise<string | null>;
}
