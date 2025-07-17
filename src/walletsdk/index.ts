import { EvmChain } from './types/types';
import {
  changeTransferGassLimitParam,
  deployAddressParam,
  disableAutoFlushParam,
  enableAutoFlushParam,
  flushMultipleTokensParam,
  flushTokenParam,
  getBalanceParam,
  predictAddressParam,
  predictDeterministicAddressParam,
  transferOwnershipParam,
  transferParam,
  transferToManyParam,
} from "./interfaces/iAddress";
import { EvmChainService } from "./chainservice/evm";
import { TvmChainService } from "./chainservice/tvm";
import TronWeb from 'tronweb';

/**
 * This class uses factory contracts to clone contracts on chain
 * when deploying a new wallet and uses create2 to generate feeless,
 * on chain wallets
 */
export default class WalletSDK {
  private _chain;
  private _network;
  private _chainType;
  private _account: {
    address: string;
    privateKey: string;
  };
  private _chainService: any;

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
  constructor(
    chain: EvmChain,
    chainType: "evm" | "tvm",
    network: "testnet" | "mainnet",
    privateKey: string,
    deployedAddress?: string,
    addressContractAddress?: string,
    factoryContractAddress?: string,
    provider?: string,
    providerApiKey?: string,
  ) {
    switch (chainType) {
      case "evm":
        this._chainService = new EvmChainService(
          privateKey,
          network,
          chain,
          deployedAddress !== undefined ? deployedAddress : undefined,
          addressContractAddress !== undefined ? addressContractAddress : undefined,
          factoryContractAddress !== undefined ? factoryContractAddress : undefined,
          provider !== undefined ? provider : undefined,
          providerApiKey !== undefined ? providerApiKey : undefined
        );

        this._account =
          this._chainService?._blockchainConnector.eth.accounts.privateKeyToAccount(
            privateKey
          );
        break;
      case "tvm":
        const tronWeb = new TronWeb({
          fullHost: network === "testnet"
            ? "https://api.shasta.trongrid.io"
            : "https://api.trongrid.io",
        });

        const publicAddress = tronWeb.address.fromPrivateKey(privateKey);
        this._chainService = new TvmChainService(
          privateKey,
          network,
          chain as any,
          provider,
          providerApiKey,
          deployedAddress,
          addressContractAddress,
          factoryContractAddress
        );
        this._account = {
          address: publicAddress,
          privateKey: privateKey
        };
        break;
    }

    this._chain = chain;
    this._chainType = chainType;
    this._network = network;
  }

  /**
   * This deploys a proxy contract to non coliding uniquely generated
   * address using a salt passed to the create2 command.
   * @param params - Parameter required for deploying a new addressWallet.
   * @returns Transaction object for the deployed contract.
   */
  public async deployAddress(params: deployAddressParam) {
    return this._chainService.deployAddress(params);
  }

  /**
   * This ensure address predicted is uniquely generated using the given salt
   * and the onwer address. This would eliminate colliding addresses.
   * @param params - Parameters required to predict a users walletAddress.
   * @returns - An address where the users walletContract will be deployed to
   */
  public async predictAddress(params: predictAddressParam) {
    const result = await this._chainService.predictAddress(params);

    return result;
  }

  public async predictDeterministicAddress(
    params: predictDeterministicAddressParam
  ) {
    return null;
  }

  /**
   * This gets the balance of native and erc20 assets.
   * @param params - Parameters required to get the balance of a deployed contract wallet.
   * @returns - Returns the tokenBalance of the wallet.
   */
  public async getBalance(params: getBalanceParam) {
    return await this._chainService.getBalance(params);
  }

  /**
   * This transfers wallet ownership to another address (most cases the users address).
   * @param params
   * @returns - Returns a transaction object.
   */
  public async transferOwnership(params: transferOwnershipParam) {
    return await this._chainService.transferOwnership(params);
  }

  /**
   * This executes transfer of native and erc20 transaction to another address.
   * @param params
   * @returns - Returns a transaction object.
   */
  public async transfer(params: transferParam) {
    return await this._chainService.transfer(params);
  }

  /**
   * This initiates transfer to many address at once in a single transaction.
   * You can also specify the erc20 token you want to send out.
   * @param params - Parameters required for transferring to many addresses.
   * @returns - Returns a transaction object.
   */
  public async transferToMany(params: transferToManyParam) {
    return await this._chainService.transferToMany(params);
  }
  /**
   * This flushes native assets to deployer/owner address.
   * @returns - Returns a transaction object.
   */
  public async flush() {
    return await this._chainService.flush();
  }
  /**
   * This Flushes a single erc20 tokens to a deployer/owner address.
   * @params - Parameters required for flushing a token.
   * @returns - Returns a transaction object.
   */
  public async flushTokens(params: flushTokenParam) {
    return await this._chainService.flushTokens(params);
  }

  /**
   * This Flushes multiple erc20 tokens to a deployer/owner address.
   * @params - Parameters required for flushing multiple tokens.
   * @returns - Returns a transaction object.
   */

  public async flushMultipleTokens(params: flushMultipleTokensParam) {
    return await this._chainService.flushMultipleTokens(params);
  }

  /**
   * This enables auto flush on incoming deposits.
   * @params - Parameters required for enabling auto flush.
   * @returns - Returns a transaction object.
   */
  public async enableAutoFlush(params: enableAutoFlushParam) {
    return await this._chainService.enableAutoFlush(params);
  }
  /**
   * This disables auto flush on incoming deposits.
   * @params - Parameters required for disabling auto flush.
   * @returns - Returns a transaction object.
   */
  public async disableAutoFlush(params: disableAutoFlushParam) {
    return await this._chainService.disableAutoFlush(params);
  }
  /**
   * This changes gas limit of on chain transfers.
   * @params - Parameters required for changing transfer gas limit.
   * @returns - Returns a transaction object.
   */
  public async changeTransferGasLimit(params: changeTransferGassLimitParam) {
    return await this._chainService.changeTransferGasLimit(params);
  }

  /**
   * Gets the current master address of the deployed contract wallet.
   * @returns - The master address as a string.
   */
  public async getMasterAddress(): Promise<string | null> {
    return await this._chainService.getMasterAddress();
  }
}
