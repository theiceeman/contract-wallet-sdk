/**
 * @jest-environment node
 *
 */

import dotenv from "dotenv";
import WalletSDK from "../../../walletsdk";
import { EvmChain } from '../../types/types';
import { parseEther } from "ethers";
dotenv.config();

const PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY ?? "";
const salt = `SHERLOCK_HOLMES_${Math.floor(Math.random() * 1000) + 1}`;
const MASTER_WALLET_ADDRESS = '0x606bCAE4De681E6145817FB6267636E6795Eec80'
const CHILD_WALLET_ADDRESS = '0x207c37EB73150ADda672B2340AfF85f1FB05e844'

const CURRENT_WALLET_ADDRESS = '0x207c37EB73150ADda672B2340AfF85f1FB05e844'


let walletSdk: WalletSDK;




beforeAll(async () => {
  walletSdk = new WalletSDK(EvmChain.BASE, "evm", "testnet", PRIVATE_KEY);
  // walletSdk = new WalletSDK(EvmChain.BASE, "evm", "testnet", PRIVATE_KEY, CURRENT_WALLET_ADDRESS);
});

/* describe("predictAddress", () => {
  test("should predict deployment address successfully", async () => {
    try {
      let predictAddressParam = { name: salt };
      const result = await walletSdk.predictAddress(predictAddressParam);
      // console.log("predictAddress ", result);
      expect(typeof result).toEqual("string");
    } catch (error) {
      console.error("predictAddress test failed:", error);
      throw error;
    }
  });
});
*/


describe("deployAddress", () => {
  // test("should fail if invalid salt is passed", async () => {
  //   const deployAddressParam = {
  //     name: "",
  //     enableAutoFlush: true,
  //   };
  //   await expect(walletSdk.deployAddress(deployAddressParam)).rejects.toThrow();
  // });

  // test("should deploy to predicted address", async () => {
  //   try {
  //     const deployAddressParam = {
  //       name: salt,
  //       enableAutoFlush: true,
  //     };
  //     let result = await walletSdk.deployAddress(deployAddressParam);
  //     console.log({ result })
  //     expect(typeof result).toEqual("string");
  //   } catch (error) {
  //     console.error("deployAddress (valid) test failed:", error);
  //     throw error;
  //   }
  // });

  test("should deploy with custom master address", async () => {
    try {
      const deployAddressParam = {
        name: salt,
        enableAutoFlush: true,
        masterAddress: "0x606bCAE4De681E6145817FB6267636E6795Eec80",
      };
      let result = await walletSdk.deployAddress(deployAddressParam);
      console.log({result})
      expect(typeof result).toEqual("string");
    } catch (error) {
      console.error("deployAddress (custom master) test failed:", error);
      throw error;
    }
  });
});


/* describe("getBalance", () => {
  test("should return balance of token", async () => {
    const getBalanceParam = {
      tokenContractAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    };
    let result = await walletSdk.getBalance(getBalanceParam);
    console.log({result})
    expect(typeof result).toEqual("bigint");
  });

  test("should return balance of native asset", async () => {
    let prevBalance = await walletSdk.getBalance({
      tokenContractAddress: CURRENT_WALLET_ADDRESS,
    });
    const getBalanceParam = {
      tokenContractAddress: CURRENT_WALLET_ADDRESS,
    };
    let result = await walletSdk.getBalance(getBalanceParam);
    console.log({result})
    expect(result).toEqual(prevBalance);
  });
});

describe("getMasterAddress", () => {
  test("should return the current master address", async () => {
    const masterAddress = await walletSdk.getMasterAddress();
    console.log({ masterAddress });
    expect(typeof masterAddress).toEqual("string");
    expect(masterAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });
}); */





/* describe("transferOwnership", () => {
  test("should transfer ownership successfully", async () => {
    const transferOwnershipParam = {
      newOwner: process.env.ETHEREUM_ADDRESS_2 ?? "",
    };
    let result = await walletSdk.transferOwnership(transferOwnershipParam);
    console.log({ result })
    expect(typeof result).toEqual("object");
  });

  test("getBalance should fail due to change in ownership", async () => {
    let getBalanceParam = {
      tokenContractAddress: CURRENT_WALLET_ADDRESS,
    };
    let result = await walletSdk.getBalance(getBalanceParam);
    console.log({ result });
    // expect(e).toMatch(/Error/);
    // expect(() => walletSdk.getBalance(getBalanceParam)).toThrow();
  });
  
  test("getBalance as new owner should be successfull", async () => {
    let balanceBefore = await walletSdk.getBalance({
      tokenContractAddress: CURRENT_WALLET_ADDRESS,
    });

    let _walletSdk = new WalletSDK(
      EvmChain.BASE,
      "evm",
      "testnet",
      process.env.ETHEREUM_PRIVATE_KEY_2 ?? "",
      CURRENT_WALLET_ADDRESS,
    );
    const getBalanceParam = {
      tokenContractAddress: CURRENT_WALLET_ADDRESS,
    };
    let result = await _walletSdk.getBalance(getBalanceParam);
    expect(result).toEqual(balanceBefore);

    // Transfer ownership back to main testing account
    const transferOwnershipParam = {
      newOwner: process.env.ETHEREUM_ADDRESS ?? "",
    };
    await _walletSdk.transferOwnership(transferOwnershipParam);
  });
}); */


/* describe("transfer", () => {
  test("should tranfer native asset successfully", async () => {
    let amount = parseEther("0.001");
    // Disable Autoflush
    await walletSdk.disableAutoFlush({ status: "disabled" });

    await sendEther(
      process.env.ETHEREUM_PRIVATE_KEY ?? "",
      CURRENT_WALLET_ADDRESS,
      String(.001)
    );
    console.log('damn!')

    let balanceBefore = await walletSdk.getBalance({
      tokenContractAddress: CURRENT_WALLET_ADDRESS,
    });

    const transferParam = {
      to: process.env.ETHEREUM_ADDRESS_2 ?? "",
      amount:String(amount), //  1
      tokenToSend: CURRENT_WALLET_ADDRESS,
    };
    let result = await walletSdk.transfer(transferParam);
    expect(typeof result).toEqual("object");

    console.log({ result })
    let getBalanceParam = {
      tokenContractAddress: CURRENT_WALLET_ADDRESS,
    };
    let balanceAfter = await walletSdk.getBalance(getBalanceParam);
    // Convert to numbers for subtraction if possible
    const balanceBeforeNum = Number(balanceBefore);
    const amountNum = Number(amount);
    const balanceAfterNum = Number(balanceAfter);
    if (!isNaN(balanceBeforeNum) && !isNaN(amountNum) && !isNaN(balanceAfterNum)) {
      expect(balanceAfterNum).toEqual(balanceBeforeNum - amountNum);
    }
  });
}); */

/* describe("transferToMany", () => {
  test("should transfer native asset successfully", async () => {
    let prevBalance = await walletSdk.getBalance({
      tokenContractAddress: USER_WALLET_ADDRESS,
    });

    const transferToManyParam = {
      recipients: [
        process.env.ETHEREUM_ADDRESS,
        process.env.ETHEREUM_ADDRESS_2,
      ], //  DEV2 Acct.
      amounts: [toEther(1), toEther(1)], //  1
      tokenToSend: USER_WALLET_ADDRESS,
    };
    await walletSdk.transferToMany(transferToManyParam);

    let getBalanceParam = {
      tokenContractAddress: USER_WALLET_ADDRESS,
    };
    let balance = await walletSdk.getBalance(getBalanceParam);
    expect(balance).toEqual(String(prevBalance - toEther(2)));
  });
});

describe("flush", () => {
  test("should flush native assets successfully", async () => {
    await walletSdk.flush();
    let getBalanceParam = {
      tokenContractAddress: USER_WALLET_ADDRESS,
    };
    let balance = await walletSdk.getBalance(getBalanceParam);
    expect(balance).toEqual("0");
  });
});  */

/* describe("flushTokens", () => {
  test("should flush a single ERC20 token to the master address", async () => {
    const flushTokenParam = {
      tokenAddress_: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // Example ERC20 token contract address
    };
    let result = await walletSdk.flushTokens(flushTokenParam);
    console.log({ result });
    expect(typeof result).toEqual("object");
    // Optionally, check the balance of the master address after flush
  });
}); */

/* describe("flushMultipleTokens", () => {
  test("should flush multiple ERC20 tokens to the master address", async () => {
    const flushMultipleTokensParam = {
      tokenAddresses: [
        "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        "0x215be2a2f68129Ce158035C4520336056F7c778B"
      ] // Example ERC20 token contract addresses
    };
    let result = await walletSdk.flushMultipleTokens(flushMultipleTokensParam);
    console.log({ result });
    expect(typeof result).toEqual("object");
    // Optionally, check the balance of the master address after flush
  });
}); */
