"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEther = sendEther;
exports.toEther = toEther;
const ethers_1 = require("ethers");
// provider: AlchemyProvider for maticmum testnet
const provider = new ethers_1.AlchemyProvider('maticmum', 'oe21CCNseQJ_m_HTQ0Y09671I-CGvbxt');
async function sendEther(privateKey, receiverAddress, amountInEther) {
    const wallet = new ethers_1.Wallet(privateKey, provider);
    const tx = {
        to: receiverAddress,
        value: (0, ethers_1.parseEther)(amountInEther),
    };
    const txObj = await wallet.sendTransaction(tx);
    return txObj.hash;
}
function toEther(amount) {
    return BigInt(amount) * 1000000000000000000n;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvd2FsbGV0c2RrL3Rlc3QvZXZtL3V0aWxzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsOEJBWUM7QUFFRCwwQkFFQztBQXhCRCxtQ0FBNkQ7QUFFN0QsaURBQWlEO0FBQ2pELE1BQU0sUUFBUSxHQUFHLElBQUksd0JBQWUsQ0FDbEMsVUFBVSxFQUNWLGtDQUFrQyxDQUNuQyxDQUFDO0FBRUssS0FBSyxVQUFVLFNBQVMsQ0FDN0IsVUFBa0IsRUFDbEIsZUFBdUIsRUFDdkIsYUFBcUI7SUFFckIsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sRUFBRSxHQUFHO1FBQ1QsRUFBRSxFQUFFLGVBQWU7UUFDbkIsS0FBSyxFQUFFLElBQUEsbUJBQVUsRUFBQyxhQUFhLENBQUM7S0FDakMsQ0FBQztJQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDcEIsQ0FBQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxNQUFjO0lBQ3BDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLG9CQUFvQixDQUFDO0FBQy9DLENBQUMifQ==