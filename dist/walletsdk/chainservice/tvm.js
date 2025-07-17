"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvmChainService = void 0;
const Wallet_1 = require("../utils/Wallet");
const types_1 = require("../types/types");
const constant_1 = require("../config/constant");
const addressABI = __importStar(require("../abis/AddressABI.tvm.json"));
const factoryABI = __importStar(require("../abis/FactoryABI.tvm.json"));
/**
 * This service allows sdk users to interact with the
 * Tron blockchain and the contract wallets deployed on them.
 */
class TvmChainService {
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
    constructor(privateKey, network, chain, provider, providerApiKey, deployedAddress, addressContractAddress, factoryContractAddress) {
        this._privateKey = privateKey;
        this._chain = chain;
        this._network = network === "testnet" ? types_1.NetTypes.TEST : types_1.NetTypes.MAIN;
        // Use Wallet to get the TronWeb provider
        const wallet = new Wallet_1.Wallet(network, chain, provider, providerApiKey, privateKey);
        this._blockchainConnector = wallet.provider;
        this._deployedAddress = deployedAddress ? deployedAddress : "";
        this._addressContractAddress = addressContractAddress
            ? addressContractAddress
            : constant_1.CUSTODIAL_GENESIS_ADDRESS_CONTRACT[network][chain.toUpperCase()];
        this._factoryContractAddress = factoryContractAddress
            ? factoryContractAddress
            : constant_1.CUSTODIAL_ADDRESS_FACTORY_CONTRACT[network][chain.toUpperCase()];
    }
    async _addressContractInstance() {
        return this._deployedAddress ? await this.generateContractInstance(this._deployedAddress, addressABI) : null;
    }
    async _factoryContractInstance() {
        return await this.generateContractInstance(this._factoryContractAddress, factoryABI);
    }
    /**
     * This deploys a proxy contract to non coliding uniquely generated
     * address using a salt passed to the create2 command.
     * @param params - Parameter required for deploying a new addressWallet.
     * @returns Transaction object for the deployed contract.
     */
    async deployAddress(params) {
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
        return await this.sendNewTransactionWithData(this._privateKey, this._factoryContractAddress, String(deployAddressFunctionAbi), deployAddressFunctionArgs);
    }
    /**
     * This ensure address predicted is uniquely generated using the given salt
     * and the onwer address. This would eliminate colliding addresses.
     * @param params - Parameters required to predict a users walletAddress.
     * @returns - An address where the users walletContract will be deployed to
     */
    async predictAddress(params) {
        if (params.name.length < 1)
            return "Error: Invalid salt passed!";
        let addressInAscii = await this.contractInteraction(await this._factoryContractInstance(), [this._addressContractAddress, params.name], "predictAddress");
        return await this._blockchainConnector.address.fromHex(addressInAscii);
    }
    async predictDeterministicAddress(params) {
        return null;
    }
    /**
     * This gets the balance of native and erc20 assets.
     * @param params - Parameters required to get the balance of a deployed contract wallet.
     * @returns - Returns the tokenBalance of the wallet.
     */
    async getBalance(params) {
        let result = await this.contractInteraction(await this._addressContractInstance(), [params?.tokenContractAddress], "getBalance");
        return Number(result);
    }
    /**
     * This executes transfer of wallet ownership to another address.
     * @param params
     * @returns - Returns a transaction object.
     */
    async transferOwnership(params) {
        let functionAbi = "transferOwnership(address)";
        let functionArgs = [
            {
                value: params.newOwner,
                type: "address",
            },
        ];
        return await this.sendNewTransactionWithData(this._privateKey, this._addressContractAddress, String(functionAbi), functionArgs);
    }
    /**
     * This executes transfer of native and erc20 transaction to another address.
     * @param params
     * @returns - Returns a transaction object.
     */
    async transfer(params) {
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
        return await this.sendNewTransactionWithData(this._privateKey, this._addressContractAddress, String(functionAbi), functionArgs);
    }
    /**
     * This initiates transfer to many address at once in a single transaction.
     * You can also specify the erc20 token you want to send out.
     * @param params - Parameters required for transferring to many addresses.
     * @returns - Returns a transaction object.
     */
    async transferToMany(params) {
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
        return await this.sendNewTransactionWithData(this._privateKey, this._addressContractAddress, String(functionAbi), functionArgs);
    }
    /**
     * This flushes native assets to deployer/owner address.
     * @returns - Returns a transaction object.
     */
    async flush() {
        let functionAbi = "flush()";
        let functionArgs = [];
        return await this.sendNewTransactionWithData(this._privateKey, this._addressContractAddress, String(functionAbi), functionArgs);
    }
    /**
     * This Flushes a single erc20 tokens to a deployer/owner address.
     * @params - Parameters required for flushing a token.
     * @returns - Returns a transaction object.
     */
    async flushTokens(params) {
        let functionAbi = "flushTokens(address)";
        let functionArgs = [
            {
                value: params.tokenAddress_,
                type: "address",
            },
        ];
        return await this.sendNewTransactionWithData(this._privateKey, this._addressContractAddress, String(functionAbi), functionArgs);
    }
    /**
     * This Flushes multiple erc20 tokens to a deployer/owner address.
     * @params - Parameters required for flushing multiple tokens.
     * @returns - Returns a transaction object.
     */
    async flushMultipleTokens(params) {
        let functionAbi = "flushTokens(address)";
        let functionArgs = [
            {
                value: params.tokenAddresses,
                type: "address[]",
            },
        ];
        return await this.sendNewTransactionWithData(this._privateKey, this._addressContractAddress, String(functionAbi), functionArgs);
    }
    /**
     * This enables auto flush on incoming deposits.
     * @params - Parameters required for enabling auto flush.
     * @returns - Returns a transaction object.
     */
    async enableAutoFlush(params) {
        let functionAbi = "enableAutoFlush()";
        let functionArgs = [];
        return await this.sendNewTransactionWithData(this._privateKey, this._addressContractAddress, String(functionAbi), functionArgs);
    }
    /**
     * This disables auto flush on incoming deposits.
     * @params - Parameters required for disabling auto flush.
     * @returns - Returns a transaction object.
     */
    async disableAutoFlush(params) {
        let functionAbi = "disableAutoFlush()";
        let functionArgs = [];
        return await this.sendNewTransactionWithData(this._privateKey, this._addressContractAddress, String(functionAbi), functionArgs);
    }
    async changeTransferGasLimit(params) {
        return await null;
    }
    /**
     * This utility function reads values from pure functions.
     * @param contractInstance - Instance of contract to be interacted with.
     * @param args - Array of arguments to be passed to the contract method being called.
     * @param method -  Contract method name to be called.
     * @returns - The contract methods return value.
     */
    async contractInteraction(contractInstance, args, method) {
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
    async generateContractInstance(contractAddress, abi) {
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
    async estimateTransactionData(privateKey, contractAddress, functionAbi, functionArgs) {
        const account = this._blockchainConnector.address.fromPrivateKey(privateKey);
        let trx = await this._blockchainConnector.transactionBuilder.triggerSmartContract(contractAddress, functionAbi, {}, functionArgs);
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
    async sendNewTransactionWithData(privateKey, contractAddress, functionAbi, functionArgs) {
        try {
            const rawTx = await this.estimateTransactionData(privateKey, contractAddress, functionAbi, functionArgs);
            if (!rawTx?.result || !rawTx?.result.result)
                throw Error("Error building raw transaction to be signed!");
            // Signing the transaction
            let signedTransaction = await this._blockchainConnector.trx.sign(rawTx?.transaction, privateKey);
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
        }
        catch (err) {
            return err;
        }
    }
}
exports.TvmChainService = TvmChainService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHZtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dhbGxldHNkay9jaGFpbnNlcnZpY2UvdHZtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUF5QztBQUN6QywwQ0FBZ0U7QUFnQmhFLGlEQUc0QjtBQUM1Qix3RUFBMEQ7QUFDMUQsd0VBQTBEO0FBRTFEOzs7R0FHRztBQUNILE1BQWEsZUFBZTtJQVkxQjs7Ozs7Ozs7OztPQVVHO0lBQ0gsWUFDRSxVQUFrQixFQUNsQixPQUE4QixFQUM5QixLQUFlLEVBQ2YsUUFBaUIsRUFDakIsY0FBdUIsRUFDdkIsZUFBd0IsRUFDeEIsc0JBQStCLEVBQy9CLHNCQUErQjtRQUUvQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUU5QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQkFBUSxDQUFDLElBQUksQ0FBQztRQUV0RSx5Q0FBeUM7UUFDekMsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBRTVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRS9ELElBQUksQ0FBQyx1QkFBdUIsR0FBRyxzQkFBc0I7WUFDbkQsQ0FBQyxDQUFDLHNCQUFzQjtZQUN4QixDQUFDLENBQUMsNkNBQWtDLENBQUMsT0FBNEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFX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