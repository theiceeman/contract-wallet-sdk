import { AvailableChains, Chains } from "../../config/constant";
import Walletsdk from "src/walletsdk";
import BigNumber from "bignumber.js";
import dotenv from "dotenv";
import { EvmChain } from "src/walletsdk/types/types";
dotenv.config();

async function suite() {
  const PRIVATE_KEY = "b3272b9663f29cd1ab62592bcbf996bf02c2edba44005cf84bb569ea8159c83f";
  const ADDRESS = "0x71CCA608C1043FBB52e9fEA359773c52801C5870";
  const salt = "TESTING_EVM_10000";

  const walletSdk = new Walletsdk(
    EvmChain.BASE,
    "evm",
    "testnet",
    PRIVATE_KEY,
  );

  /*   const getBalanceParam = {
      tokenContractAddress: "0xc1e88c5861efb0c17750dceca57a73f274410f24", 
    };
    let answer = await walletSdk.getBalance(getBalanceParam);
    console.log('answer ', answer) */
  // let address = await walletSdk.predictAddress(predictAddressParam);

  let count = 10000;
  let addresses = [];

  const predictAddressParam = {
    name: salt,
  };
  // Ensure address predicted is uniquely generated using the given salt and the onwer address.
  // for (let index = 0; index < count; index++) {
  //   const predictAddressParam = {
  //     name: `e6fd98dbE9_EVM_${index}`,
  //   };
  //   let address = await walletSdk.predictAddress(predictAddressParam);
  //   if (addresses.includes(address)) {
  //     console.log("Found dup", address)
  //   } else {
  //     addresses.push(address)

  //   }
  //   // console.log("address ", address);
  // }
  // console.log("Done")

  const deployAddressParam = {
    name: salt,
    enableAutoFlush: true,
  };

  const address = await walletSdk.predictAddress(predictAddressParam);
  console.log("address ", address);

  let result = await walletSdk.deployAddress(deployAddressParam);
  console.log("result ", result);

  const getBalanceParam = {
    tokenContractAddress: "0xFab46E002BbF0b4509813474841E0716E6730136", //  Volare Wrapped Ether Vault on Ropsten
  };

  // let balanceBeforeFau = await walletSdk.getBalance({
  //   tokenContractAddress: "0xFab46E002BbF0b4509813474841E0716E6730136", //  Volare Wrapped Ether Vault on Ropsten
  // });

  // let balanceBeforTUSD = await walletSdk.getBalance({
  //   tokenContractAddress: "0xD20AaD119cb81c1D2A530cb7fe5847BC60c65f38", //  Volare Wrapped Ether Vault on Ropsten
  // });
  // console.log("balanceBefore ", balanceBeforeFau, balanceBeforTUSD);

  // let resultToken = await walletSdk.flushMultipleTokens({
  //   tokenAddresses: ["0xFab46E002BbF0b4509813474841E0716E6730136", "0xD20AaD119cb81c1D2A530cb7fe5847BC60c65f38"]
  // });
  // console.log("result ", resultToken);

  // let balanceAfter = await walletSdk.getBalance(getBalanceParam);
  // console.log("balanceAfter ", balanceAfter);/
  // // let resultToken = await walletSdk.flush()
  // console.log("result ", resultToken);

  // Deploys a proxy contract to non coliding uniquely generated address using a salt passed to the create2 command.
  /*  const deployAddressParam = {
    name: salt,
    enableAutoFlush: true,
  };
  let result = await walletSdk.deployAddress(deployAddressParam);
  console.log("result", result) */

  // Get the balance of native and erc20 assets.  - pending

  /* const getBalanceParam = {
    tokenContractAddress: "0xd61144557dfB4953C20c376AfFa6b4a3780C99D1", //  Volare Wrapped Ether Vault on Ropsten
  };
  let result = await walletSdk.getBalance(getBalanceParam);
  console.log("result ", result);
  console.log("result ", typeof result); */

  //  Transfer contract ownership to another address - pending

  /*  const transferOwnershipParam = {
    newOwner: '0xFD0876A0AE8F678A390c96e5DF94e74523EfFA98',
  };
  let result = await walletSdk.transferOwnership(transferOwnershipParam);
  console.log("result ", result); */

  //  Transfer native and erc20 transaction to another address - pending
  //  const transferParam = {
  //     to: '0x560c6067b94048F92Bd89e44D205c3597A4fe82E',
  //     amount: BigNumber("400000000000000000"), //  0.5
  //     tokenToSend: "0x1b98763E459c4Ab84cf9200250dE469660326460",
  //   };
  //   let result = await walletSdk.transfer(transferParam);
  //   console.log("result ", result);

  //  Transfer native and erc20 transaction to another address - pending

  //   const transferToManyParam = {
  //   recipients: [
  //     '0x560c6067b94048F92Bd89e44D205c3597A4fe82E',
  //     '0x71CCA608C1043FBB52e9fEA359773c52801C5870',
  //   ],
  //   amounts: [
  //     BigNumber("1000000000000000000"),
  //     BigNumber("1000000000000000000"),
  //   ],
  //   tokenToSend: "0x1b98763E459c4Ab84cf9200250dE469660326460",
  // };
  // let result = await walletSdk.transferToMany(transferToManyParam);
  // console.log("result ", result);

  //  Flush native assets to deployer/owner address - pending

  /*   let result = await walletSdk.flush();
    console.log("result ", result); */

  //  Flush a single erc20 tokens to a deployer/owner address - pending
  /*  const flushTokenParam = {
     tokenAddress_: "0xc1e88c5861eFb0c17750dCeCa57A73f274410F24",
   };
 
   let result = await walletSdk.flushTokens(flushTokenParam);
   console.log("result ", result); */

  //  Flush multiple erc20 tokens to a deployer/owner address - pending

  // const flushMultipleTokensParam = {
  //   tokenAddresses: [
  //     "0x1b98763E459c4Ab84cf9200250dE469660326460",
  //     "0xc1e88c5861eFb0c17750dCeCa57A73f274410F24",
  //   ],
  // };

  // let result = await walletSdk.flushMultipleTokens(flushMultipleTokensParam);
  // console.log(result);

  // Enable auto flush on incoming deposits
  // const enableAutoFlushParam = {
  //   privateKey: PRIVATE_KEY,
  //   name: salt,
  //   status: "enabled",
  //   testnet: true,
  //   chain: AvailableChains.TRON,
  // };

  // let result = await walletSdk.enableAutoFlush();
  //   console.log("result ", result);

  // Disable auto flush on incoming deposits
  /*   let result = await walletSdk.disableAutoFlush();
    console.log("result ", result); */
}
suite();
