import Web3 from "web3";
import { Wallet } from '../utils/Wallet';
import { EvmChain, NetTypes } from '../types/types';
import { Contract } from "web3-eth-contract";
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
} from "../interfaces/iAddress";
import {
  CUSTODIAL_GENESIS_ADDRESS_CONTRACT,
  CUSTODIAL_ADDRESS_FACTORY_CONTRACT,
} from "./../config/constant";
import * as EVMAddressABI from "./../abis/WalletABI.evm.json";
import * as EVMFactoryABI from "./../abis/FactoryABI.evm.json";

/**
 * This service allows sdk users to interact with the
 * Ethereum blockchain and the contract wallets deployed on them.
 */
export class EvmChainService {
  public _blockchainConnector;
  private _privateKey;
  private _publicAddress;
  private _chain: EvmChain;
  private _network: "TEST" | "MAIN";
  private _addressContractAddress: string;
  private _factoryContractAddress: string;
  // private _addressContractInstance: any;
  // private _factoryContractInstance: any;
  private _deployedAddress: string;
  private _providerUrl?: string;
  private _apiKey?: string;

  /**
   * This is the Evm microservice for the Ethereum Blockchain.
   * @param privateKey - Private key of account used to interact with the sdk.
   * @param network - Testnet or Mainnet of the blockchain.
   * @param publicAddress - Public address associated with the private key passed.
   * @param chain - Blockchain connected to.
   * @param deployedAddress - Address of the deployed wallet clone contract; if deployed already.
   * @param addressContractAddress - Address of the user's genesis wallet contract to be cloned.
   * @param factoryContractAddress - Address of the user's genesis factory contract.
   * @param provider - An optional provider connection to the blockchain.
   * @param apiKey - Optional API key for the provider.
   */
  constructor(
    privateKey: string,
    network: "testnet" | "mainnet",
    chain: EvmChain,
    deployedAddress?: string,
    addressContractAddress?: string,
    factoryContractAddress?: string,
    provider?: string,
    apiKey?: string,
  ) {
    this._privateKey = privateKey;
    this._providerUrl = provider;
    this._apiKey = apiKey;

    // Generate public address from private key
    const web3 = new Web3();
    const account = web3.eth.accounts.privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : '0x' + privateKey);
    this._publicAddress = account.address;

    this._chain = chain;
    this._network = network === "testnet" ? "TEST" : "MAIN";

    // Use the selected provider
    this._blockchainConnector = new Web3(this._selectProvider(provider));

    this._deployedAddress = deployedAddress ? deployedAddress : "";
    this._addressContractAddress = addressContractAddress
      ? addressContractAddress
      : CUSTODIAL_GENESIS_ADDRESS_CONTRACT[network as unknown as string][
      chain.toUpperCase()
      ];
    this._factoryContractAddress = factoryContractAddress
      ? factoryContractAddress
      : CUSTODIAL_ADDRESS_FACTORY_CONTRACT[network as unknown as string][
      chain.toUpperCase()
      ];
  }

  private _selectProvider(provider?: string): any {
    if (provider) {
      return new Web3.providers.HttpProvider(provider);
    } else {
      const walletProvider = new Wallet(NetTypes[this._network], this._chain);
      return walletProvider.provider.currentProvider;
    }
  }

  private async _addressContractInstance() {
    return this._deployedAddress
      ? await this.generateContractInstance(
        this._deployedAddress,
        EVMAddressABI
      )
      : null;
  }

  private async _factoryContractInstance() {
    return await this.generateContractInstance(
      this._factoryContractAddress,
      EVMFactoryABI
    );
  }

  /**
   * This utility function reads values from pure functions.
   * @param contractInstance - Instance of contract to be interacted with.
   * @param args - Array of arguments to be passed to the contract method being called.
   * @param method -  Contract method name to be called.
   * @param operationType - Type of operation to be performed on contract method.
   * @returns - The contract methods return value.
   */
  public async contractInteraction(
    contractInstance: any,
    args: (string | string[] | boolean)[],
    method: string,
    operationType: string
  ) {
    switch (operationType) {
      case "call":
        return await (await contractInstance).methods[method](...args).call();
      case "send":
        return (await contractInstance).methods[method](...args).encodeABI();
    }
  }
  /**
   * This returns an instance of deployed contracts so its methods can be called.
   * @param contractAddress - Address of contract to be instantiated.
   * @param abi - Abi of the contract.
   * @returns - Returns an instance of the contract.
   */
  public async generateContractInstance(
    contractAddress: string,
    abi: any
  ): Promise<Contract<any>> {
    return await new this._blockchainConnector.eth.Contract(
      abi.abi,
      contractAddress,
      {
        from: this._publicAddress,
      }
    );
  }
  /**
   * This returns a transaction object but doesnt actually broadcast the transaction to the network.
   * @param privateKey - Private key of contract to sign the transaction.
   * @param contractAddress - Contract address being interacted with.
   * @param functionAbi - Function signature of method being called.
   * @param functionArgs - Abi of the input parameters to be passed to the function argument.
   * @returns - Returns a transaction object simulating a real transaction sent.
   */
  private async estimateTransactionData(data: any, contractAddress: string) {
    const wallet = new Wallet(NetTypes[this._network], this._chain);
    // console.log('_privateKey', this._privateKey);return;
    const account = this._blockchainConnector.eth.accounts.privateKeyToAccount(
      this._privateKey
    );

    const nonce = this._blockchainConnector.utils.toHex(
      await this._blockchainConnector.eth.getTransactionCount(account.address)
    );

    let passedData = await data;

    let rawTx: any = {
      nonce,
      to: contractAddress,
      data: passedData,
    };
    // console.log('damn!', rawTx);return 'yay';

    // Fetch current block's gas limit
    const latestBlock = await this._blockchainConnector.eth.getBlock('latest');
    const blockGasLimit = Number(latestBlock.gasLimit);

    // Estimate gas and cap to block gas limit
    const estimatedGasRaw = await this._blockchainConnector.eth.estimateGas({
      nonce: Number(nonce),
      from: account.address,
      to: contractAddress,
      data: passedData,
    });
    const estimatedGas = Number(estimatedGasRaw);
    const gasLimit = this._blockchainConnector.utils.toHex(
      Math.min(estimatedGas, blockGasLimit)
    );

    //return
    rawTx = {
      ...rawTx,
      value: "0x0",
      gasLimit: gasLimit,
      gasPrice: this._blockchainConnector.utils.toHex(
        await this._blockchainConnector.eth.getGasPrice()
      ),
      privKey: this._privateKey.slice(2, this._privateKey.length),
    };
    return {
      callerAddress: account.address,
      contractAddress,
      nonce,
      rawData: passedData,
      fee: {
        fee: await wallet.calculateGasFee(rawTx.gasPrice, rawTx.gasLimit),
        gasLimit: rawTx.gasLimit,
        gasPrice: rawTx.gasPrice,
      },
    };
  }
  /**
   * This broadcasts transactions to the network.
   * @param privateKey - Private key of contract to sign the transaction.
   * @param contractAddress - Contract address being interacted with.
   * @param functionAbi - Function signature of method being called.
   * @param functionArgs - Abi of the input parameters to be passed to the function argument.
   * @returns - Returns a transaction object.
   */
  public async sendNewTransactionWithData(data: any, contractAddress: string) {
    const wallet = new Wallet(
      NetTypes[this._network],
      this._chain,
      this._providerUrl,
      this._apiKey,
      this._privateKey
    );

    const rawTx = await this.estimateTransactionData(data, contractAddress);

    const txtToSend = {
      nonce: rawTx.nonce,
      to: rawTx.contractAddress,
      data: rawTx.rawData,
      value: "0x0",
      gasLimit: rawTx.fee.gasLimit,
      gasPrice: rawTx.fee.gasPrice,
      privKey: this._privateKey,
    };

    return await wallet.send({ ...txtToSend });
  }

  /**
   * This deploys a proxy contract to non coliding uniquely generated
   * address using a salt passed to the create2 command.
   * @param params - Parameter required for deploying a new addressWallet.
   * @param params.name - The salt used for generating the address; this has to be unique.
   * @param params.enableAutoFlush - Whether to enable auto flush on incoming deposits.
   * @param params.masterAddress - Optional master address for the deployed wallet. If not provided, uses the user's public address.
   * @returns Transaction object for the deployed contract.
   */
  public async deployAddress(params: deployAddressParam) {
    const masterAddress = params.masterAddress || this._publicAddress;
    
    let data = await this.contractInteraction(
      await this._factoryContractInstance(),
      [
        this._addressContractAddress,
        masterAddress,
        params.name,
        params.enableAutoFlush,
      ],
      "deployAddress",
      "send"
    );
    return await this.sendNewTransactionWithData(
      data,
      this._factoryContractAddress
    );
  }

  /**
   * This ensure address predicted is uniquely generated using the given salt
   * and the onwer address. This would eliminate colliding addresses.
   * @param params - Parameters required to predict a users walletAddress.
   * @returns - An address where the users walletContract will be deployed to
   */
  public async predictAddress(params: predictAddressParam) {
    return await this.contractInteraction(
      await this._factoryContractInstance(),
      [this._addressContractAddress, params.name],
      "predictAddress",
      "call"
    );
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
    return await this.contractInteraction(
      await this._addressContractInstance(),
      [params.tokenContractAddress],
      "getBalance",
      "call"
    );
  }
  public async transferOwnership(params: transferOwnershipParam) {
    let data = await this.contractInteraction(
      await this._addressContractInstance(),
      [params.newOwner],
      "transferOwnership",
      "send"
    );
    return await this.sendNewTransactionWithData(data, this._deployedAddress);
  }

  /**
   * This executes transfer of native and erc20 transaction to another address.
   * @param params
   * @returns - Returns a transaction object.
   */
  public async transfer(params: transferParam) {
    let data = await this.contractInteraction(
      await this._addressContractInstance(),
      [params.to, params.amount, params.tokenToSend],
      "transfer",
      "send"
    );
    return await this.sendNewTransactionWithData(data, this._deployedAddress);
  }
  /**
   * This initiates transfer to many address at once in a single transaction.
   * You can also specify the erc20 token you want to send out.
   * @param params - Parameters required for transferring to many addresses.
   * @returns - Returns a transaction object.
   */
  public async transferToMany(params: transferToManyParam) {
    let data = await this.contractInteraction(
      await this._addressContractInstance(),
      [[...params.recipients], [...params.amounts], params.tokenToSend],
      "transferToMany",
      "send"
    );
    return await this.sendNewTransactionWithData(data, this._deployedAddress);
  }
  /**
   * This flushes native assets to deployer/owner address.
   * @returns - Returns a transaction object.
   */
  public async flush() {
    let data = await this.contractInteraction(
      await this._addressContractInstance(),
      [],
      "flush",
      "send"
    );
    return await this.sendNewTransactionWithData(data, this._deployedAddress);
  }
  /**
   * This Flushes a single erc20 tokens to a deployer/owner address.
   * @params - Parameters required for flushing a token.
   * @returns - Returns a transaction object.
   */
  public async flushTokens(params: flushTokenParam) {
    let data = await this.contractInteraction(
      await this._addressContractInstance(),
      [params.tokenAddress_],
      "flushTokens",
      "send"
    );

    return await this.sendNewTransactionWithData(data, this._deployedAddress);
  }
  /**
   * This Flushes multiple erc20 tokens to a deployer/owner address.
   * @params - Parameters required for flushing multiple tokens.
   * @returns - Returns a transaction object.
   */
  public async flushMultipleTokens(params: flushMultipleTokensParam) {
    let data = await this.contractInteraction(
      await this._addressContractInstance(),
      [[...params.tokenAddresses]],
      "flushMultipleTokens",
      "send"
    );
    return await this.sendNewTransactionWithData(data, this._deployedAddress);
  }
  /**
   * This enables auto flush on incoming deposits.
   * @params - Parameters required for enabling auto flush.
   * @returns - Returns a transaction object.
   */
  public async enableAutoFlush(params: enableAutoFlushParam) {
    let data = await this.contractInteraction(
      await this._addressContractInstance(),
      [],
      "enableAutoFlush",
      "send"
    );
    return await this.sendNewTransactionWithData(data, this._deployedAddress);
  }
  /**
   * This disables auto flush on incoming deposits.
   * @params - Parameters required for disabling auto flush.
   * @returns - Returns a transaction object.
   */
  public async disableAutoFlush(params: disableAutoFlushParam) {
    let data = await this.contractInteraction(
      await this._addressContractInstance(),
      [],
      "disableAutoFlush",
      "send"
    );
    return await this.sendNewTransactionWithData(data, this._deployedAddress);
  }

  public async changeTransferGasLimit(params: changeTransferGassLimitParam) {
    let data = await this.contractInteraction(
      await this._addressContractInstance(),
      [params.limit],
      "changeTransferGasLimit",
      "send"
    );
    return await this.sendNewTransactionWithData(data, this._deployedAddress);
  }

  /**
   * Gets the current master address of the deployed contract wallet.
   * @returns - The master address as a string.
   */
  public async getMasterAddress(): Promise<string | null> {
    const contractInstance = await this._addressContractInstance();
    if (!contractInstance) return null;
    return await contractInstance.methods.master().call();
  }
}
