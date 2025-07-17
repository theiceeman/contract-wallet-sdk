import { Wallet, AlchemyProvider, parseEther } from 'ethers';

// provider: AlchemyProvider for maticmum testnet
const provider = new AlchemyProvider(
  'maticmum',
  'oe21CCNseQJ_m_HTQ0Y09671I-CGvbxt'
);

export async function sendEther(
  privateKey: string,
  receiverAddress: string,
  amountInEther: string
): Promise<string> {
  const wallet = new Wallet(privateKey, provider);
  const tx = {
    to: receiverAddress,
    value: parseEther(amountInEther),
  };
  const txObj = await wallet.sendTransaction(tx);
  return txObj.hash;
}

export function toEther(amount: number): bigint {
  return BigInt(amount) * 1000000000000000000n;
}
