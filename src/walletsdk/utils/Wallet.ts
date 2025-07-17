import Web3 from 'web3';
import BN from 'bn.js';
import TronWeb from 'tronweb';

export class Wallet {
  public provider: any;
  private chain: string;
  private privateKey?: string;

  constructor(
    netType: string,
    chain: string,
    providerUrl?: string,
    apiKey?: string,
    privateKey?: string
  ) {
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

      const headers: any = {};
      if (apiKey || process.env.TRON_API_KEY) {
        headers["TRON-PRO-API-KEY"] = apiKey || process.env.TRON_API_KEY;
      }

      this.provider = new TronWeb({
        fullHost,
        headers,
        privateKey,
      });
    } else {
      // EVM logic
      let rpcUrl = providerUrl;
      if (!rpcUrl) {
        if (ch === 'ethereum') {
          rpcUrl = net === 'MAINNET'
            ? 'https://ethereum-rpc.publicnode.com'
            : 'https://ethereum-sepolia-rpc.publicnode.com';
        } else if (ch === 'base') {
          rpcUrl = net === 'MAINNET'
            ? 'https://mainnet.base.org'
            : 'https://sepolia.base.org';
        } else if (ch === 'bsc') {
          rpcUrl = net === 'MAINNET'
            ? 'https://bsc-rpc.publicnode.com'
            : 'https://bsc-testnet-rpc.publicnode.com';
        } else if (ch === 'arbitrum') {
          rpcUrl = net === 'MAINNET'
            ? 'https://arb1.arbitrum.io/rpc'
            : 'https://sepolia-rollup.arbitrum.io/rpc';
        } else {
          rpcUrl = '';
        }
      }
      this.provider = new Web3(new Web3.providers.HttpProvider(rpcUrl || ''));
    }
  }

  calculateGasFee(gasPrice: string, gasLimit: string): string {
    // Both gasPrice and gasLimit are hex strings
    const price = new BN(gasPrice.replace(/^0x/, ''), 16);
    const limit = new BN(gasLimit.replace(/^0x/, ''), 16);
    return price.mul(limit).toString();
  }

  async send(tx: any): Promise<any> {
    if (this.chain === 'tron') {
      return this._sendTronTransaction(tx);
    } else {
      return this._sendEvmTransaction(tx);
    }
  }

  private async _sendEvmTransaction(tx: any): Promise<any> {
    if (!this.privateKey) throw new Error('Private key required for EVM transactions');
    try {
      const privKey = this.privateKey.startsWith('0x') ? this.privateKey : '0x' + this.privateKey;
      const signed = await this.provider.eth.accounts.signTransaction(tx, privKey);
      if (!signed.rawTransaction) throw new Error('Failed to sign transaction');
      const receipt = await this.provider.eth.sendSignedTransaction(signed.rawTransaction);
      return receipt;
    } catch (err) {
      throw new Error(`EVM transaction failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  private async _sendTronTransaction(tx: any): Promise<any> {
    if (!this.privateKey) throw new Error('Private key required for Tron transactions');
    try {
      let signedTx = tx;
      if (!tx.signature) {
        signedTx = await this.provider.trx.sign(tx, this.privateKey);
      }
      const result = await this.provider.trx.sendRawTransaction(signedTx);
      return result;
    } catch (err) {
      throw new Error(`Tron transaction failed: ${err instanceof Error ? err.message : err}`);
    }
  }
} 