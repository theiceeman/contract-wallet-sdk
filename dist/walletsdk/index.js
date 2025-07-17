"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const evm_1 = require("./chainservice/evm");
const tvm_1 = require("./chainservice/tvm");
const tronweb_1 = __importDefault(require("tronweb"));
/**
 * This class uses factory contracts to clone contracts on chain
 * when deploying a new wallet and uses create2 to generate feeless,
 * on chain wallets
 */
class WalletSDK {
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
    constructor(chain, chainType, network, privateKey, deployedAddress, addressContractAddress, factoryContractAddress, provider, providerApiKey) {
        switch (chainType) {
            case "evm":
                this._chainService = new evm_1.EvmChainService(privateKey, network, chain, deployedAddress !== undefined ? deployedAddress : undefined, addressContractAddress !== undefined ? addressContractAddress : undefined, factoryContractAddress !== undefined ? factoryContractAddress : undefined, provider !== undefined ? provider : undefined, providerApiKey !== undefined ? providerApiKey : undefined);
                this._account =
                    this._chainService?._blockchainConnector.eth.accounts.privateKeyToAccount(privateKey);
                break;
            case "tvm":
                const tronWeb = new tronweb_1.default({
                    fullHost: network === "testnet"
                        ? "https://api.shasta.trongrid.io"
                        : "https://api.trongrid.io",
                });
                const publicAddress = tronWeb.address.fromPrivateKey(privateKey);
                this._chainService = new tvm_1.TvmChainService(privateKey, network, chain, provider, providerApiKey, deployedAddress, addressContractAddress, factoryContractAddress);
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
    async deployAddress(params) {
        return this._chainService.deployAddress(params);
    }
    /**
     * This ensure address predicted is uniquely generated using the given salt
     * and the onwer address. This would eliminate colliding addresses.
     * @param params - Parameters required to predict a users walletAddress.
     * @returns - An address where the users walletContract will be deployed to
     */
    async predictAddress(params) {
        const result = await this._chainService.predictAddress(params);
        return result;
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
        return await this._chainService.getBalance(params);
    }
    /**
     * This transfers wallet ownership to another address (most cases the users address).
     * @param params
     * @returns - Returns a transaction object.
     */
    async transferOwnership(params) {
        return await this._chainService.transferOwnership(params);
    }
    /**
     * This executes transfer of native and erc20 transaction to another address.
     * @param params
     * @returns - Returns a transaction object.
     */
    async transfer(params) {
        return await this._chainService.transfer(params);
    }
    /**
     * This initiates transfer to many address at once in a single transaction.
     * You can also specify the erc20 token you want to send out.
     * @param params - Parameters required for transferring to many addresses.
     * @returns - Returns a transaction object.
     */
    async transferToMany(params) {
        return await this._chainService.transferToMany(params);
    }
    /**
     * This flushes native assets to deployer/owner address.
     * @returns - Returns a transaction object.
     */
    async flush() {
        return await this._chainService.flush();
    }
    /**
     * This Flushes a single erc20 tokens to a deployer/owner address.
     * @params - Parameters required for flushing a token.
     * @returns - Returns a transaction object.
     */
    async flushTokens(params) {
        return await this._chainService.flushTokens(params);
    }
    /**
     * This Flushes multiple erc20 tokens to a deployer/owner address.
     * @params - Parameters required for flushing multiple tokens.
     * @returns - Returns a transaction object.
     */
    async flushMultipleTokens(params) {
        return await this._chainService.flushMultipleTokens(params);
    }
    /**
     * This enables auto flush on incoming deposits.
     * @params - Parameters required for enabling auto flush.
     * @returns - Returns a transaction object.
     */
    async enableAutoFlush(params) {
        return await this._chainService.enableAutoFlush(params);
    }
    /**
     * This disables auto flush on incoming deposits.
     * @params - Parameters required for disabling auto flush.
     * @returns - Returns a transaction object.
     */
    async disableAutoFlush(params) {
        return await this._chainService.disableAutoFlush(params);
    }
    /**
     * This changes gas limit of on chain transfers.
     * @params - Parameters required for changing transfer gas limit.
     * @returns - Returns a transaction object.
     */
    async changeTransferGasLimit(params) {
        return await this._chainService.changeTransferGasLimit(params);
    }
    /**
     * Gets the current master address of the deployed contract wallet.
     * @returns - The master address as a string.
     */
    async getMasterAddress() {
        return await this._chainService.getMasterAddress();
    }
}
exports.default = WalletSDK;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2FsbGV0c2RrL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBZUEsNENBQXFEO0FBQ3JELDRDQUFxRDtBQUNyRCxzREFBOEI7QUFFOUI7Ozs7R0FJRztBQUNILE1BQXFCLFNBQVM7SUFVNUI7Ozs7Ozs7Ozs7T0FVRztJQUNILFlBQ0UsS0FBZSxFQUNmLFNBQXdCLEVBQ3hCLE9BQThCLEVBQzlCLFVBQWtCLEVBQ2xCLGVBQXdCLEVBQ3hCLHNCQUErQixFQUMvQixzQkFBK0IsRUFDL0IsUUFBaUIsRUFDakIsY0FBdUI7UUFFdkIsUUFBUSxTQUFTLEVBQUUsQ0FBQztZQUNsQixLQUFLLEtBQUs7Z0JBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHFCQUFlLENBQ3RDLFVBQVUsRUFDVixPQUFPLEVBQ1AsS0FBSyxFQUNMLGVBQWUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUMzRCxzQkFBc0IsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQ3pFLHNCQUFzQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFDekUsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQzdDLGNBQWMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUMxRCxDQUFDO2dCQUVGLElBQUksQ0FBQyxRQUFRO29CQUNYLElBQUksQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FDdkUsVUFBVSxDQUNYLENBQUM7Z0JBQ0osTUFBTTtZQUNSLEtBQUssS0FBSztnQkFDUixNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUM7b0JBQzFCLFFBQVEsRUFBRSxPQUFPLEtBQUssU0FBUzt3QkFDN0IsQ0FBQyxDQUFDLGdDQUFnQzt3QkFDbEMsQ0FBQyxDQUFDLHlCQUF5QjtpQkFDOUIsQ0FBQyxDQUFDO2dCQUVILE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkscUJBQWUsQ0FDdEMsVUFBVSxFQUNWLE9BQU8sRUFDUCxLQUFZLEVBQ1osUUFBUSxFQUNSLGNBQWMsRUFDZCxlQUFlLEVBQ2Ysc0JBQXNCLEVBQ3RCLHNCQUFzQixDQUN2QixDQUFDO2dCQUNGLElBQUksQ0FBQyxRQUFRLEdBQUc7b0JBQ2QsT0FBTyxFQUFFLGFBQWE7b0JBQ3RCLFVBQVUsRUFBRSxVQUFVO2lCQUN2QixDQUFDO2dCQUNGLE1BQU07UUFDVixDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUEwQjtRQUNuRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBMkI7UUFDckQsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU0sS0FBSyxDQUFDLDJCQUEyQixDQUN0QyxNQUF3QztRQUV4QyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUF1QjtRQUM3QyxPQUFPLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBOEI7UUFDM0QsT0FBTyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQXFCO1FBQ3pDLE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQTJCO1FBQ3JELE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLEtBQUs7UUFDaEIsT0FBTyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQXVCO1FBQzlDLE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUVJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxNQUFnQztRQUMvRCxPQUFPLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBNEI7UUFDdkQsT0FBTyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQTZCO1FBQ3pELE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLHNCQUFzQixDQUFDLE1BQW9DO1FBQ3RFLE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsZ0JBQWdCO1FBQzNCLE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDckQsQ0FBQztDQUNGO0FBMU1ELDRCQTBNQyJ9