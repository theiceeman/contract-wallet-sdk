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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvmChainService = void 0;
const web3_1 = __importDefault(require("web3"));
const Wallet_1 = require("../utils/Wallet");
const types_1 = require("../types/types");
const constant_1 = require("./../config/constant");
const EVMAddressABI = __importStar(require("./../abis/WalletABI.evm.json"));
const EVMFactoryABI = __importStar(require("./../abis/FactoryABI.evm.json"));
/**
 * This service allows sdk users to interact with the
 * Ethereum blockchain and the contract wallets deployed on them.
 */
class EvmChainService {
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
    constructor(privateKey, network, chain, deployedAddress, addressContractAddress, factoryContractAddress, provider, apiKey) {
        this._privateKey = privateKey;
        this._providerUrl = provider;
        this._apiKey = apiKey;
        // Generate public address from private key
        const web3 = new web3_1.default();
        const account = web3.eth.accounts.privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : '0x' + privateKey);
        this._publicAddress = account.address;
        this._chain = chain;
        this._network = network === "testnet" ? "TEST" : "MAIN";
        // Use the selected provider
        this._blockchainConnector = new web3_1.default(this._selectProvider(provider));
        this._deployedAddress = deployedAddress ? deployedAddress : "";
        this._addressContractAddress = addressContractAddress
            ? addressContractAddress
            : constant_1.CUSTODIAL_GENESIS_ADDRESS_CONTRACT[network][chain.toUpperCase()];
        this._factoryContractAddress = factoryContractAddress
            ? factoryContractAddress
            : constant_1.CUSTODIAL_ADDRESS_FACTORY_CONTRACT[network][chain.toUpperCase()];
    }
    _selectProvider(provider) {
        if (provider) {
            return new web3_1.default.providers.HttpProvider(provider);
        }
        else {
            const walletProvider = new Wallet_1.Wallet(types_1.NetTypes[this._network], this._chain);
            return walletProvider.provider.currentProvider;
        }
    }
    async _addressContractInstance() {
        return this._deployedAddress
            ? await this.generateContractInstance(this._deployedAddress, EVMAddressABI)
            : null;
    }
    async _factoryContractInstance() {
        return await this.generateContractInstance(this._factoryContractAddress, EVMFactoryABI);
    }
    /**
     * This utility function reads values from pure functions.
     * @param contractInstance - Instance of contract to be interacted with.
     * @param args - Array of arguments to be passed to the contract method being called.
     * @param method -  Contract method name to be called.
     * @param operationType - Type of operation to be performed on contract method.
     * @returns - The contract methods return value.
     */
    async contractInteraction(contractInstance, args, method, operationType) {
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
    async generateContractInstance(contractAddress, abi) {
        return await new this._blockchainConnector.eth.Contract(abi.abi, contractAddress, {
            from: this._publicAddress,
        });
    }
    /**
     * This returns a transaction object but doesnt actually broadcast the transaction to the network.
     * @param privateKey - Private key of contract to sign the transaction.
     * @param contractAddress - Contract address being interacted with.
     * @param functionAbi - Function signature of method being called.
     * @param functionArgs - Abi of the input parameters to be passed to the function argument.
     * @returns - Returns a transaction object simulating a real transaction sent.
     */
    async estimateTransactionData(data, contractAddress) {
        const wallet = new Wallet_1.Wallet(types_1.NetTypes[this._network], this._chain);
        // console.log('_privateKey', this._privateKey);return;
        const account = this._blockchainConnector.eth.accounts.privateKeyToAccount(this._privateKey);
        const nonce = this._blockchainConnector.utils.toHex(await this._blockchainConnector.eth.getTransactionCount(account.address));
        let passedData = await data;
        let rawTx = {
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
        const gasLimit = this._blockchainConnector.utils.toHex(Math.min(estimatedGas, blockGasLimit));
        //return
        rawTx = {
            ...rawTx,
            value: "0x0",
            gasLimit: gasLimit,
            gasPrice: this._blockchainConnector.utils.toHex(await this._blockchainConnector.eth.getGasPrice()),
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
    async sendNewTransactionWithData(data, contractAddress) {
        const wallet = new Wallet_1.Wallet(types_1.NetTypes[this._network], this._chain, this._providerUrl, this._apiKey, this._privateKey);
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
    async deployAddress(params) {
        const masterAddress = params.masterAddress || this._publicAddress;
        const factoryInstance = await this._factoryContractInstance();
        let data = await this.contractInteraction(factoryInstance, [
            this._addressContractAddress,
            masterAddress,
            params.name,
            params.enableAutoFlush,
        ], "deployAddress", "send");
        // Send the transaction and get the receipt
        const receipt = await this.sendNewTransactionWithData(data, this._factoryContractAddress);
        // Use web3 to compute the Cloned event signature from the ABI
        const web3 = this._blockchainConnector;
        const clonedEventAbi = EVMFactoryABI.abi.find((i) => i.type === 'event' && i.name === 'Cloned');
        if (!clonedEventAbi) {
            throw new Error('Cloned event ABI not found');
        }
        const clonedEventSig = web3.eth.abi.encodeEventSignature(clonedEventAbi);
        const clonedLog = receipt.logs.find((log) => log.topics && log.topics[0] === clonedEventSig);
        if (clonedLog) {
            // clone is the first indexed param (topics[1])
            const deployedAddress = '0x' + clonedLog.topics[1].slice(26);
            return deployedAddress;
        }
        throw new Error('Deployed address not found in transaction logs');
    }
    /**
     * This ensure address predicted is uniquely generated using the given salt
     * and the onwer address. This would eliminate colliding addresses.
     * @param params - Parameters required to predict a users walletAddress.
     * @returns - An address where the users walletContract will be deployed to
     */
    async predictAddress(params) {
        return await this.contractInteraction(await this._factoryContractInstance(), [this._addressContractAddress, params.name], "predictAddress", "call");
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
        return await this.contractInteraction(await this._addressContractInstance(), [params.tokenContractAddress], "getBalance", "call");
    }
    async transferOwnership(params) {
        let data = await this.contractInteraction(await this._addressContractInstance(), [params.newOwner], "transferOwnership", "send");
        return await this.sendNewTransactionWithData(data, this._deployedAddress);
    }
    /**
     * This executes transfer of native and erc20 transaction to another address.
     * @param params
     * @returns - Returns a transaction object.
     */
    async transfer(params) {
        let data = await this.contractInteraction(await this._addressContractInstance(), [params.to, params.amount, params.tokenToSend], "transfer", "send");
        return await this.sendNewTransactionWithData(data, this._deployedAddress);
    }
    /**
     * This initiates transfer to many address at once in a single transaction.
     * You can also specify the erc20 token you want to send out.
     * @param params - Parameters required for transferring to many addresses.
     * @returns - Returns a transaction object.
     */
    async transferToMany(params) {
        let data = await this.contractInteraction(await this._addressContractInstance(), [[...params.recipients], [...params.amounts], params.tokenToSend], "transferToMany", "send");
        return await this.sendNewTransactionWithData(data, this._deployedAddress);
    }
    /**
     * This flushes native assets to deployer/owner address.
     * @returns - Returns a transaction object.
     */
    async flush() {
        let data = await this.contractInteraction(await this._addressContractInstance(), [], "flush", "send");
        return await this.sendNewTransactionWithData(data, this._deployedAddress);
    }
    /**
     * This Flushes a single erc20 tokens to a deployer/owner address.
     * @params - Parameters required for flushing a token.
     * @returns - Returns a transaction object.
     */
    async flushTokens(params) {
        let data = await this.contractInteraction(await this._addressContractInstance(), [params.tokenAddress_], "flushTokens", "send");
        return await this.sendNewTransactionWithData(data, this._deployedAddress);
    }
    /**
     * This Flushes multiple erc20 tokens to a deployer/owner address.
     * @params - Parameters required for flushing multiple tokens.
     * @returns - Returns a transaction object.
     */
    async flushMultipleTokens(params) {
        let data = await this.contractInteraction(await this._addressContractInstance(), [[...params.tokenAddresses]], "flushMultipleTokens", "send");
        return await this.sendNewTransactionWithData(data, this._deployedAddress);
    }
    /**
     * This enables auto flush on incoming deposits.
     * @params - Parameters required for enabling auto flush.
     * @returns - Returns a transaction object.
     */
    async enableAutoFlush(params) {
        let data = await this.contractInteraction(await this._addressContractInstance(), [], "enableAutoFlush", "send");
        return await this.sendNewTransactionWithData(data, this._deployedAddress);
    }
    /**
     * This disables auto flush on incoming deposits.
     * @params - Parameters required for disabling auto flush.
     * @returns - Returns a transaction object.
     */
    async disableAutoFlush(params) {
        let data = await this.contractInteraction(await this._addressContractInstance(), [], "disableAutoFlush", "send");
        return await this.sendNewTransactionWithData(data, this._deployedAddress);
    }
    async changeTransferGasLimit(params) {
        let data = await this.contractInteraction(await this._addressContractInstance(), [params.limit], "changeTransferGasLimit", "send");
        return await this.sendNewTransactionWithData(data, this._deployedAddress);
    }
    /**
     * Gets the current master address of the deployed contract wallet.
     * @returns - The master address as a string.
     */
    async getMasterAddress() {
        const contractInstance = await this._addressContractInstance();
        if (!contractInstance)
            return null;
        return await contractInstance.methods.master().call();
    }
}
exports.EvmChainService = EvmChainService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dhbGxldHNkay9jaGFpbnNlcnZpY2UvZXZtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUF3QjtBQUN4Qiw0Q0FBeUM7QUFDekMsMENBQW9EO0FBZ0JwRCxtREFHOEI7QUFDOUIsNEVBQThEO0FBQzlELDZFQUErRDtBQUUvRDs7O0dBR0c7QUFDSCxNQUFhLGVBQWU7SUFjMUI7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxZQUNFLFVBQWtCLEVBQ2xCLE9BQThCLEVBQzlCLEtBQWUsRUFDZixlQUF3QixFQUN4QixzQkFBK0IsRUFDL0Isc0JBQStCLEVBQy9CLFFBQWlCLEVBQ2pCLE1BQWU7UUFFZixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QiwyQ0FBMkM7UUFDM0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLEVBQUUsQ0FBQztRQUN4QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQztRQUNwSCxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFFdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUV4RCw0QkFBNEI7UUFDNUIsSUFBSSxDQUFD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