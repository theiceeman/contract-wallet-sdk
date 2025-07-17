/**
 * @jest-environment node
 *
 */

import { AvailableChains } from "../../../../dist/src/config/constant.js";
import Walletsdk from "../../../../dist/src/index.js";
import TronWeb from "tronweb";
import dotenv from "dotenv";
import { sendTrx, toSun } from "./utils/utils.js";
dotenv.config();

const PRIVATE_KEY = process.env.TRON_PRIVATE_KEY;
const USER_WALLET_ADDRESS = "TRQUkyZww3F7JKWUBNAsnJubXVeqeKr2QD";
let account, salt, tronWeb, walletSdk, address;

beforeAll(async () => {
  salt = "jack_TRONTRON_7";

  tronWeb = new TronWeb({
    fullHost: "https://api.shasta.trongrid.io",
    headers: {
      "TRON-PRO-API-KEY": process.env.TRON_API_KEY,
      "Content-Type": "application/json",
    },
    privateKey: PRIVATE_KEY,
  });
  account = await tronWeb.address.fromPrivateKey(PRIVATE_KEY);

  walletSdk = new Walletsdk(
    AvailableChains.TRON,
    "tvm",
    "testnet",
    PRIVATE_KEY,
    account,
    USER_WALLET_ADDRESS
  );
});

describe("predictAddress", () => {
  test("should predict deployment address successfully", async () => {
    let predictAddressParam = {
      name: salt,
    };
    const result = await walletSdk.predictAddress(predictAddressParam);
    console.log("predictAddress ", result);
    expect(typeof result).toEqual("string");
  });
  test("should fail if empty string is passed as salt", async () => {
    let predictAddressParam = {
      name: "",
    };
    let result = await walletSdk.predictAddress(predictAddressParam);
    expect(result).toMatch(/Error/);
  });
});

/* describe("deployAddress", () => {
    test("should fail if invalid salt is passed", async () => {
    const deployAddressParam = {
      name: "",
      enableAutoFlush: true,
    };
    expect(() => walletSdk.deployAddress(deployAddressParam)).toThrow();
  });
  test("should deploy to predicted address", async () => {
    const deployAddressParam = {
      name: salt,
      enableAutoFlush: true,
    };
    let result = await walletSdk.deployAddress(deployAddressParam);
    expect(typeof result).toEqual("object");
  });
}); */

describe("getBalance", () => {
  test("should return balance of token", async () => {
    const getBalanceParam = {
      tokenContractAddress: "TQKucgWL1cbAtW8vxKbwRgThw3FPmrok2t", //  PiAToken (PiA) on Shasta
    };
    let result = await walletSdk.getBalance(getBalanceParam);
    expect(result).toEqual(0);
  });
  test("should return balance of native asset", async () => {
    const getBalanceParam = {
      tokenContractAddress: USER_WALLET_ADDRESS,
    };
    let result = await walletSdk.getBalance(getBalanceParam);
    expect(result).toEqual(0);
  });
});

describe("transferOwnership", () => {
  test("should transfer ownership successfully", async () => {
    const transferOwnershipParam = {
      newOwner: process.env.TRON_ADDRESS_2,
    };
    let result = await walletSdk.transferOwnership(transferOwnershipParam);
    expect(typeof result).toEqual("object");
  });
  test("getBalance should fail due to change in ownership", async () => {
    let getBalanceParam = {
      tokenContractAddress: USER_WALLET_ADDRESS,
    };
    try {
      await walletSdk.getBalance(getBalanceParam);
    } catch (e) {
      expect(e).toEqual("REVERT opcode executed");
    }
  });
  test("getBalance as new owner should be successfull", async () => {
    let walletSdk = new Walletsdk(
      AvailableChains.TRON,
      "tvm",
      "testnet",
      process.env.TRON_PRIVATE_KEY_2,
      process.env.TRON_ADDRESS_2,
      USER_WALLET_ADDRESS
    );
    const getBalanceParam = {
      tokenContractAddress: USER_WALLET_ADDRESS,
    };
    let result = await walletSdk.getBalance(getBalanceParam);
    expect(result).toEqual(0);

    // Transfer ownership back to main testing account
    const transferOwnershipParam = {
      newOwner: process.env.TRON_ADDRESS,
    };
    await walletSdk.transferOwnership(transferOwnershipParam);
  });
});

describe("transfer", () => {
  test("should tranfer native asset successfully", async () => {
    // Send 3 TRX to user wallet for testing transfer function
    await sendTrx(
      process.env.TRON_PRIVATE_KEY,
      account,
      USER_WALLET_ADDRESS,
      toSun(3)
    );

    let prevBalance = await walletSdk.getBalance({
      tokenContractAddress: USER_WALLET_ADDRESS,
    });

    const transferParam = {
      to: process.env.TRON_ADDRESS_2,
      amount: toSun(1), //  1
      tokenToSend: USER_WALLET_ADDRESS,
    };
    let result = await walletSdk.transfer(transferParam);
    expect(typeof result).toEqual("object");

    let getBalanceParam = {
      tokenContractAddress: USER_WALLET_ADDRESS,
    };
    let balance = await walletSdk.getBalance(getBalanceParam);
    expect(balance).toEqual(prevBalance - toSun(1));
  });
});
describe("transferToMany", () => {
  test("should transfer native asset successfully", async () => {
    let prevBalance = await walletSdk.getBalance({
      tokenContractAddress: USER_WALLET_ADDRESS,
    });

    const transferToManyParam = {
      recipients: [process.env.TRON_ADDRESS, process.env.TRON_ADDRESS_2], //  DEV2 Acct.
      amounts: [toSun(1), toSun(1)], //  1
      tokenToSend: USER_WALLET_ADDRESS,
    };
    await walletSdk.transferToMany(transferToManyParam);

    let getBalanceParam = {
      tokenContractAddress: USER_WALLET_ADDRESS,
    };
    let balance = await walletSdk.getBalance(getBalanceParam);
    expect(balance).toEqual(prevBalance - toSun(2));
  });
});

describe("flush", () => {
  test("should flush native assets successfully", async () => {
    await walletSdk.flush();
    let getBalanceParam = {
      tokenContractAddress: USER_WALLET_ADDRESS,
    };
    let balance = await walletSdk.getBalance(getBalanceParam);
    expect(balance).toEqual(0);
  });
});
