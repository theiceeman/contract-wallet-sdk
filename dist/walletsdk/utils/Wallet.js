"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const web3_1 = __importDefault(require("web3"));
const bn_js_1 = __importDefault(require("bn.js"));
const tronweb_1 = __importDefault(require("tronweb"));
class Wallet {
    constructor(netType, chain, providerUrl, apiKey, privateKey) {
        const net = netType.toLowerCase().includes('main') ? 'MAINNET' : 'TESTNET';
        const ch = chain.toLowerCase();
        this.chain = ch;
        this.privateKey = privateKey;
        if (ch === 'tron') {
            // Tron logic
            const fullHost = providerUrl
                ? providerUrl
                : net === 'MAINNET'
                    ? 'https://api.trongrid.io'
                    : 'https://api.shasta.trongrid.io';
            const headers = {};
            if (apiKey || process.env.TRON_API_KEY) {
                headers["TRON-PRO-API-KEY"] = apiKey || process.env.TRON_API_KEY;
            }
            this.provider = new tronweb_1.default({
                fullHost,
                headers,
                privateKey,
            });
        }
        else {
            // EVM logic
            let rpcUrl = providerUrl;
            if (!rpcUrl) {
                if (ch === 'ethereum') {
                    rpcUrl = net === 'MAINNET'
                        ? 'https://ethereum-rpc.publicnode.com'
                        : 'https://ethereum-sepolia-rpc.publicnode.com';
                }
                else if (ch === 'base') {
                    rpcUrl = net === 'MAINNET'
                        ? 'https://mainnet.base.org'
                        : 'https://sepolia.base.org';
                }
                else if (ch === 'bsc') {
                    rpcUrl = net === 'MAINNET'
                        ? 'https://bsc-rpc.publicnode.com'
                        : 'https://bsc-testnet-rpc.publicnode.com';
                }
                else if (ch === 'arbitrum') {
                    rpcUrl = net === 'MAINNET'
                        ? 'https://arb1.arbitrum.io/rpc'
                        : 'https://sepolia-rollup.arbitrum.io/rpc';
                }
                else {
                    rpcUrl = '';
                }
            }
            this.provider = new web3_1.default(new web3_1.default.providers.HttpProvider(rpcUrl || ''));
        }
    }
    calculateGasFee(gasPrice, gasLimit) {
        // Both gasPrice and gasLimit are hex strings
        const price = new bn_js_1.default(gasPrice.replace(/^0x/, ''), 16);
        const limit = new bn_js_1.default(gasLimit.replace(/^0x/, ''), 16);
        return price.mul(limit).toString();
    }
    async send(tx) {
        if (this.chain === 'tron') {
            return this._sendTronTransaction(tx);
        }
        else {
            return this._sendEvmTransaction(tx);
        }
    }
    async _sendEvmTransaction(tx) {
        if (!this.privateKey)
            throw new Error('Private key required for EVM transactions');
        try {
            const privKey = this.privateKey.startsWith('0x') ? this.privateKey : '0x' + this.privateKey;
            const signed = await this.provider.eth.accounts.signTransaction(tx, privKey);
            if (!signed.rawTransaction)
                throw new Error('Failed to sign transaction');
            const receipt = await this.provider.eth.sendSignedTransaction(signed.rawTransaction);
            return receipt;
        }
        catch (err) {
            throw new Error(`EVM transaction failed: ${err instanceof Error ? err.message : err}`);
        }
    }
    async _sendTronTransaction(tx) {
        if (!this.privateKey)
            throw new Error('Private key required for Tron transactions');
        try {
            let signedTx = tx;
            if (!tx.signature) {
                signedTx = await this.provider.trx.sign(tx, this.privateKey);
            }
            const result = await this.provider.trx.sendRawTransaction(signedTx);
            return result;
        }
        catch (err) {
            throw new Error(`Tron transaction failed: ${err instanceof Error ? err.message : err}`);
        }
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2FsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dhbGxldHNkay91dGlscy9XYWxsZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQXdCO0FBQ3hCLGtEQUF1QjtBQUN2QixzREFBOEI7QUFFOUIsTUFBYSxNQUFNO0lBS2pCLFlBQ0UsT0FBZSxFQUNmLEtBQWEsRUFDYixXQUFvQixFQUNwQixNQUFlLEVBQ2YsVUFBbUI7UUFFbkIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDM0UsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBRTdCLElBQUksRUFBRSxLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQ2xCLGFBQWE7WUFDYixNQUFNLFFBQVEsR0FBRyxXQUFXO2dCQUMxQixDQUFDLENBQUMsV0FBVztnQkFDYixDQUFDLENBQUMsR0FBRyxLQUFLLFNBQVM7b0JBQ2pCLENBQUMsQ0FBQyx5QkFBeUI7b0JBQzNCLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQztZQUV2QyxNQUFNLE9BQU8sR0FBUSxFQUFFLENBQUM7WUFDeEIsSUFBSSxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdkMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO1lBQ25FLENBQUM7WUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sQ0FBQztnQkFDMUIsUUFBUTtnQkFDUixPQUFPO2dCQUNQLFVBQVU7YUFD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