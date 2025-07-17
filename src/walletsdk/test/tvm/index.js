const { default: BigNumber } = require("bignumber.js");
const { AvailableChains } = require("../../dist/src/config/constant.js");
const Walletsdk = require("../../dist/src/index.js");
require("dotenv").config();

async function suite() {
  const PRIVATE_KEY = process.env.TRON_PRIVATE_KEY;
  const ADDRESS = process.env.TRON_ADDRESS;
  const salt = "jack_TRONTRON_7";

  // jack_TRONTRON_6 - TYCfX9Uc1bueA5c8wsPtK1sANovja6ixTJ
  const walletSdk = new Walletsdk.default(
    AvailableChains.TRON,
    "tvm",
    "testnet",
    PRIVATE_KEY,
    ADDRESS,
    "TRQUkyZww3F7JKWUBNAsnJubXVeqeKr2QD"
  );
  // Ensure address predicted is uniquely generated using the given salt and the onwer address.
  /*   const predictAddressParam = {
    name: salt,
  };
  const result = await walletSdk.predictAddress(predictAddressParam);
  console.log("result ", result); */

  // Deploys a proxy contract to non coliding uniquely generated address using a salt passed to the create2 command.

  /* const deployAddressParam = {
    name: salt,
    enableAutoFlush: true,
  };
  let result = await walletSdk.deployAddress(deployAddressParam);
  console.log("result", result) */

  // Get the balance of native and erc20 assets.  - pending
  /*     const getBalanceParam = {
    tokenContractAddress: "TQKucgWL1cbAtW8vxKbwRgThw3FPmrok2t", //  PiAToken (PiA) on Shasta
  };
  let result = await walletSdk.getBalance(getBalanceParam);
  console.log("result ", result); */

  //  Transfer contract ownership to another address - pending
  /*   const transferOwnershipParam = {
    newOwner: process.env.TRON_ADDRESS_2,
  };
  let result = await walletSdk.transferOwnership(transferOwnershipParam);
  console.log("result ", result); */

  //  Transfer native and erc20 transaction to another address - pending

  /*   const transferParam = {
    to: process.env.TRON_ADDRESS_2,
    amount: 1000000, //  1
    tokenToSend: "TRQUkyZww3F7JKWUBNAsnJubXVeqeKr2QD",
  };
  let result = await walletSdk.transfer(transferParam);
  console.log("result ", result); */

  //  Transfer native and erc20 transaction to another address - pending

  /*   const transferToManyParam = {
    recipients: [
      "TSLP56WDwtX8qYCNzbJkZs9KD3PFwzZuvg",
      "TBX7eEZEPAu6MdCLBPPvwHTER7L7qEBDHu",
    ], //  DEV2 Acct.
    amounts: [500000, 500000],  //  0.5
    tokenToSend: "TRQUkyZww3F7JKWUBNAsnJubXVeqeKr2QD",
  };
  let result = await walletSdk.transferToMany(transferToManyParam);
  console.log("result ", result); */

  //  Flush native assets to deployer/owner address - pending
  let result = await walletSdk.flush();
  console.log("result ", result);

  //  Flush a single erc20 tokens to a deployer/owner address - pending
  /*   const flushTokenParam = {
      privateKey: PRIVATE_KEY,
      name: salt,
      tokenAddress_: "TQKucgWL1cbAtW8vxKbwRgThw3FPmrok2t",
      testnet: true,
      chain: AvailableChains.TRON,
    };
  
    let result = await walletSdk.flushTokens(flushTokenParam);
  console.log("result ", result); */

  //  Flush multiple erc20 tokens to a deployer/owner address - pending
  /*    const flushMultipleTokensParam = {
     privateKey: PRIVATE_KEY,
     name: salt,
     status: "enabled",
     testnet: true,
     chain: AvailableChains.TRON,
   };
 
   await walletSdk.flushMultipleTokens(flushMultipleTokensParam); */

  // Enable auto flush on incoming deposits
  /* const enableAutoFlushParam = {
    privateKey: PRIVATE_KEY,
    name: salt,
    status: "enabled",
    testnet: true,
    chain: AvailableChains.TRON,
  };

  await walletSdk.enableAutoFlush(enableAutoFlushParam); */

  // Disable auto flush on incoming deposits
  /* 
  const disableAutoFlushParam = {
    privateKey: PRIVATE_KEY,
    name: salt,
    status: "enabled",
    testnet: true,
    chain: AvailableChains.TRON,
  };

  await walletSdk.disableAutoFlush(disableAutoFlushParam);
 */
}
suite();
