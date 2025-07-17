import { Contract } from 'web3-eth-contract';
import { NetTypes, EvmChain } from '../types/types';
export interface IChain {
    _blockchainConnector: string;
    _privateKey: string;
    _publicAddress: string;
    _chain: EvmChain;
    _network: NetTypes;
    contractInteraction(contractInstance: any, args: any, method: string, operationType?: ['call', 'send']): Promise<void>;
    generateContractInstance(contractAddress: string, abi: any): Promise<Contract<any>>;
    estimateTransactionData(data: any, contractAddress: string, abi?: string, args?: object[]): Promise<void>;
    sendNewTransactionWithData(data: any): Promise<void>;
}
