# Contract Wallet SDK

### Environment Variable Names

Use the following pattern for environment variable names:

```
<CHAIN>_<NETWORK>_RPC_URL
```

Where:
- `<CHAIN>` is the uppercase name of the chain (e.g., ETHEREUM, POLYGON, BSC)
- `<NETWORK>` is the uppercase network (MAINNET or TESTNET)

#### Example:

```
CWS_ETHEREUM_MAINNET_RPC_URL=https://mainnet.infura.io/v3/your-key
CWS_ETHEREUM_TESTNET_RPC_URL=https://goerli.infura.io/v3/your-key
CWS_POLYGON_MAINNET_RPC_URL=https://polygon-rpc.com
CWS_POLYGON_TESTNET_RPC_URL=https://matic-mumbai.chainstacklabs.com
CWS_BSC_MAINNET_RPC_URL=https://bsc-dataseed.binance.org/
CWS_BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```
