import TronWeb from "tronweb";
async function sendTrx(privateKey, from, to, amount) {
  let tronWeb = new TronWeb({
    fullHost: "https://api.shasta.trongrid.io",
    headers: {
      "TRON-PRO-API-KEY": process.env.TRON_API_KEY,
      "Content-Type": "application/json",
    },
    privateKey,
  });
  // Create an unsigned TRX transfer transaction
  const tradeobj = await tronWeb.transactionBuilder.sendTrx(to, amount, from);
  // Sign
  const signedtxn = await tronWeb.trx.sign(tradeobj, privateKey);
  // Broadcast
  const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
  return receipt;
}
function toSun(amount) {
  return amount * 1000000;
}

module.exports = {
  sendTrx,
  toSun,
};
