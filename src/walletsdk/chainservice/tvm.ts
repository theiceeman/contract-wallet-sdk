import { Wallet } from '../utils/Wallet';
import { NetTypes, TokenTypes, TvmChain } from '../types/types';
import TronWeb from "tronweb";
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
} from "../config/constant";
import * as addressABI from "../abis/AddressABI.tvm.json";
import * as factoryABI from "../abis/FactoryABI.tvm.json";

/**
 * This service allows sdk users to interact with the
 * Tron blockchain and the contract wallets deployed on them.
 */
export class TvmChainService {
  public _blockchainConnector;
  private _privateKey;
  // private _publicAddress;
  private _chain: TvmChain;
  private _network: NetTypes;
  private _addressContractAddress: string;
  private _factoryContractAddress: string;
  // private _addressContractInstance: any;
  // private _factoryContractInstance: any;
  private _deployedAddress: any;

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
  constructor(
    privateKey: string,
    network: "testnet" | "mainnet",
    chain: TvmChain,
    provider?: string,
    providerApiKey?: string,
    deployedAddress?: string,
    addressContractAddress?: string,
    factoryContractAddress?: string
  ) {
    this._privateKey = privateKey;
    
    this._chain = chain;
    this._network = network === "testnet" ? NetTypes.TEST : NetTypes.MAIN;

    // Use Wallet to get the TronWeb provider
    const wallet = new Wallet(network, chain, provider, providerApiKey, privateKey);
    this._blockchainConnector = wallet.provider;

    this._deployedAddress = deployedAddress ? deployedAddress : "";

    this._addressContractAddress = addressContractAddress
      ? addressContractAddress
      : CUSTODIAL_GENESIS_ADDRESS_CONTRACT[network as unknown as string][chain.toUpperCase()];

    this._factoryContractAddress = factoryContractAddress
      ? factoryContractAddress
      : CUSTODIAL_ADDRESS_FACTORY_CONTRACT[network as unknown as string][chain.toUpperCase()];
  }


  private async _addressContractInstance() {
    return this._deployedAddress ? await this.generateContractInstance(
      this._deployedAddress,
      addressABI
    ) : null
  }

  private async _factoryContractInstance() {
    return await this.generateContractInstance(
      this._factoryContractAddress,
      factoryABI
    );
  }

  /**
   * This deploys a proxy contract to non coliding uniquely generated
   * address using a salt passed to the create2 command.
   * @param params - Parameter required for deploying a new addressWallet.
   * @returns Transaction object for the deployed contract.
   */
  public async deployAddress(params: deployAddressParam) {
    let deployAddressFunctionAbi = "deployAddress(address,string,bool)";
    let deployAddressFunctionArgs = [
      {
        value: this._addressContractAddress,
        type: "address",
      },
      {
        value: params.name,
        type: "string",
      },
      {
        value: params.enableAutoFlush,
        type: "bool",
      },
    ];

    return await this.sendNewTransactionWithData(
      this._privateKey,
      this._factoryContractAddress,
      String(deployAddressFunctionAbi),
      deployAddressFunctionArgs
    );
  }

  /**
   * This ensure address predicted is uniquely generated using the given salt
   * and the onwer address. This would eliminate colliding addresses.
   * @param params - Parameters required to predict a users walletAddress.
   * @returns - An address where the users walletContract will be deployed to
   */
  public async predictAddress(params: predictAddressParam) {
    if (params.name.length < 1) return "Error: Invalid salt passed!";

    let addressInAscii = await this.contractInteraction(
      await this._factoryContractInstance(),
      [this._addressContractAddress, params.name],
      "predictAddress"
    );

    return await this._blockchainConnector.address.fromHex(addressInAscii);
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
    let result = await this.contractInteraction(
      await this._addressContractInstance(),
      [params?.tokenContractAddress],
      "getBalance"
    );
    return Number(result);
  }
  /**
   * This executes transfer of wallet ownership to another address.
   * @param params
   * @returns - Returns a transaction object.
   */
  public async transferOwnership(params: transferOwnershipParam) {
    let functionAbi = "transferOwnership(address)";
    let functionArgs = [
      {
        value: params.newOwner,
        type: "address",
      },
    ];
    return await this.sendNewTransactionWithData(
      this._privateKey,
      this._addressContractAddress,
      String(functionAbi),
      functionArgs
    );
  }

  /**
   * This executes transfer of native and erc20 transaction to another address.
   * @param params
   * @returns - Returns a transaction object.
   */
  public async transfer(params: transferParam) {
    let functionAbi = "transfer(address,uint256,address)";
    let functionArgs = [
      {
        value: params.to,
        type: "address",
      },
      {
        value: params.amount,
        type: "uint256",
      },
      {
        value: params.tokenToSend,
        type: "address",
      },
    ];
    return await this.sendNewTransactionWithData(
      this._privateKey,
      this._addressContractAddress,
      String(functionAbi),
      functionArgs
    );
  }

  /**
   * This initiates transfer to many address at once in a single transaction.
   * You can also specify the erc20 token you want to send out.
   * @param params - Parameters required for transferring to many addresses.
   * @returns - Returns a transaction object.
   */
  public async transferToMany(params: transferToManyParam) {
    let functionAbi = "transferToMany(address[],uint256[],address)";
    let functionArgs = [
      {
        value: params.recipients,
        type: "address[]",
      },
      {
        value: params.amounts,
        type: "uint256[]",
      },
      {
        value: params.tokenToSend,
        type: "address",
      },
    ];
    return await this.sendNewTransactionWithData(
      this._privateKey,
      this._addressContractAddress,
      String(functionAbi),
      functionArgs
    );
  }

  /**
   * This flushes native assets to deployer/owner address.
   * @returns - Returns a transaction object.
   */
  public async flush() {
    let functionAbi = "flush()";
    let functionArgs: [] = [];
    return await this.sendNewTransactionWithData(
      this._privateKey,
      this._addressContractAddress,
      String(functionAbi),
      functionArgs
    );
  }

  /**
   * This Flushes a single erc20 tokens to a deployer/owner address.
   * @params - Parameters required for flushing a token.
   * @returns - Returns a transaction object.
   */
  public async flushTokens(params: flushTokenParam) {
    let functionAbi = "flushTokens(address)";
    let functionArgs = [
      {
        value: params.tokenAddress_,
        type: "address",
      },
    ];
    return await this.sendNewTransactionWithData(
      this._privateKey,
      this._addressContractAddress,
      String(functionAbi),
      functionArgs
    );
  }
  /**
   * This Flushes multiple erc20 tokens to a deployer/owner address.
   * @params - Parameters required for flushing multiple tokens.
   * @returns - Returns a transaction object.
   */
  public async flushMultipleTokens(params: flushMultipleTokensParam) {
    let functionAbi = "flushTokens(address)";
    let functionArgs = [
      {
        value: params.tokenAddresses,
        type: "address[]",
      },
    ];
    return await this.sendNewTransactionWithData(
      this._privateKey,
      this._addressContractAddress,
      String(functionAbi),
      functionArgs
    );
  }

  /**
   * This enables auto flush on incoming deposits.
   * @params - Parameters required for enabling auto flush.
   * @returns - Returns a transaction object.
   */
  public async enableAutoFlush(params: enableAutoFlushParam) {
    let functionAbi = "enableAutoFlush()";
    let functionArgs: [] = [];
    return await this.sendNewTransactionWithData(
      this._privateKey,
      this._addressContractAddress,
      String(functionAbi),
      functionArgs
    );
  }
  /**
   * This disables auto flush on incoming deposits.
   * @params - Parameters required for disabling auto flush.
   * @returns - Returns a transaction object.
   */
  public async disableAutoFlush(params: disableAutoFlushParam) {
    let functionAbi = "disableAutoFlush()";
    let functionArgs: [] = [];
    return await this.sendNewTransactionWithData(
      this._privateKey,
      this._addressContractAddress,
      String(functionAbi),
      functionArgs
    );
  }
  public async changeTransferGasLimit(params: changeTransferGassLimitParam) {
    return await null;
  }

  /**
   * This utility function reads values from pure functions.
   * @param contractInstance - Instance of contract to be interacted with.
   * @param args - Array of arguments to be passed to the contract method being called.
   * @param method -  Contract method name to be called.
   * @returns - The contract methods return value.
   */
  private async contractInteraction(
    contractInstance: any,
    args: string[],
    method: string
  ) {
    return (await contractInstance).methods[method](...args).call({
      _isConstant: true,
    });
  }

  /**
   * This returns an instance of deployed contracts so its methods can be called.
   * @param contractAddress - Address of contract to be instantiated.
   * @param abi - Abi of the contract.
   * @returns - Returns an instance of the contract.
   */
  private async generateContractInstance(contractAddress: string, abi: any) {
    return await this._blockchainConnector.contract(abi.abi, contractAddress);
  }

  /**
   * This returns a transaction object but doesnt actually broadcast the transaction to the network.
   * @param privateKey - Private key of contract to sign the transaction.
   * @param contractAddress - Contract address being interacted with.
   * @param functionAbi - Function signature of method being called.
   * @param functionArgs - Abi of the input parameters to be passed to the function argument.
   * @returns - Returns a transaction object simulating a real transaction sent.
   */
  private async estimateTransactionData(
    privateKey: string,
    contractAddress: string,
    functionAbi: string,
    functionArgs: object[] | []
  ) {
    const account =
      this._blockchainConnector.address.fromPrivateKey(privateKey);

    let trx =
      await this._blockchainConnector.transactionBuilder.triggerSmartContract(
        contractAddress,
        functionAbi,
        {},
        functionArgs
      );
    // console.log({ trx });

    return {
      ...trx,
      contractAddress,
      callerAddress: account,
      hash: trx?.transaction.txID,
      rawData: trx?.transaction.raw_data_hex,
      bandwidth: await this._blockchainConnector.trx.getBandwidth(account),
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
  private async sendNewTransactionWithData(
    privateKey: string,
    contractAddress: string,
    functionAbi: string,
    functionArgs: object[] | []
  ): Promise<any> {
    try {
      const rawTx = await this.estimateTransactionData(
        privateKey,
        contractAddress,
        functionAbi,
        functionArgs
      );
      if (!rawTx?.result || !rawTx?.result.result)
        throw Error("Error building raw transaction to be signed!");

      // Signing the transaction
      let signedTransaction = await this._blockchainConnector.trx.sign(
        rawTx?.transaction,
        privateKey
      );

      if (!signedTransaction.signature) {
        throw Error("Transaction was not signed properly!");
      }
      // console.log({ signedTransaction });
      // Broadcasting the transaction
      await this._blockchainConnector.trx.sendRawTransaction(signedTransaction);

      return {
        raw: rawTx,
        hash: rawTx?.transaction.txID,
        contractAddress,
        callerAddress: rawTx.callerAddress,
        rawData: rawTx?.transaction.raw_data_hex,
      };
    } catch (err) {
      return err;
    }
  }
}
