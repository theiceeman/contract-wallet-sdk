import { TvmChain } from '../types/types';
import { changeTransferGassLimitParam, deployAddressParam, disableAutoFlushParam, enableAutoFlushParam, flushMultipleTokensParam, flushTokenParam, getBalanceParam, predictAddressParam, predictDeterministicAddressParam, transferOwnershipParam, transferParam, transferToManyParam } from "../interfaces/iAddress";
/**
 * This service allows sdk users to interact with the
 * Tron blockchain and the contract wallets deployed on them.
 */
export declare class TvmChainService {
    _blockchainConnector: any;
    private _privateKey;
    private _chain;
    private _network;
    private _addressContractAddress;
    private _factoryContractAddress;
    private _deployedAddress;
    /**
     * This is the Tvm microservice for the TRON Blockchain.
     * @param privateKey - Private key of account used to interact with the sdk.
     * @param network - Testnet or Mainnet of the blockchain.
     * @param chain - Blockchain connected to.
     * @param provider - An optional provider connection to the blockchain.
     * @param providerApiKey - An optional API key for the provider connection.
     * @param deployedAddress - Address of the deployed wallet clone contract; if deployed already.
     * @param addressContractAddress - Address of the user's genesis wallet contract to be cloned.
     * @param factoryContractAddress - Address of the user's genesis factory contract.
     */
    constructor(privateKey: string, network: "testnet" | "mainnet", chain: TvmChain, provider?: string, providerApiKey?: string, deployedAddress?: string, addressContractAddress?: string, factoryContractAddress?: string);
    private _addressContractInstance;
    private _factoryContractInstance;
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
    getBalance(params: getBalanceParam): Promise<number>;
    /**
     * This executes transfer of wallet ownership to another address.
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
    changeTransferGasLimit(params: changeTransferGassLimitParam): Promise<null>;
    /**
     * This utility function reads values from pure functions.
     * @param contractInstance - Instance of contract to be interacted with.
     * @param args - Array of arguments to be passed to the contract method being called.
     * @param method -  Contract method name to be called.
     * @returns - The contract methods return value.
     */
    private contractInteraction;
    /**
     * This returns an instance of deployed contracts so its methods can be called.
     * @param contractAddress - Address of contract to be instantiated.
     * @param abi - Abi of the contract.
     * @returns - Returns an instance of the contract.
     */
    private generateContractInstance;
    /**
     * This returns a transaction object but doesnt actually broadcast the transaction to the network.
     * @param privateKey - Private key of contract to sign the transaction.
     * @param contractAddress - Contract address being interacted with.
     * @param functionAbi - Function signature of method being called.
     * @param functionArgs - Abi of the input parameters to be passed to the function argument.
     * @returns - Returns a transaction object simulating a real transaction sent.
     */
    private estimateTransactionData;
    /**
     * This broadcasts transactions to the network.
     * @param privateKey - Private key of contract to sign the transaction.
     * @param contractAddress - Contract address being interacted with.
     * @param functionAbi - Function signature of method being called.
     * @param functionArgs - Abi of the input parameters to be passed to the function argument.
     * @returns - Returns a transaction object.
     */
    private sendNewTransactionWithData;
}
