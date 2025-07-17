export type deployAddressParam = {
    name: string;
    enableAutoFlush: boolean;
    masterAddress?: string;
};
export type predictDeterministicAddressParam = {};
export type getBalanceParam = {
    tokenContractAddress: string;
};
/**
 * name - salt for user.
 */
export type predictAddressParam = {
    name: string;
};
export type transferOwnershipParam = {
    newOwner: string;
};
export type transferParam = {
    to: string;
    amount: string;
    tokenToSend: string;
};
export type transferToManyParam = {
    recipients: Array<string>;
    amounts: Array<string>;
    tokenToSend: string;
};
export type flushTokenParam = {
    tokenAddress_: string;
};
export type flushMultipleTokensParam = {
    tokenAddresses: string[];
};
export type enableAutoFlushParam = {
    status: 'enabled';
};
export type disableAutoFlushParam = {
    status: 'disabled';
};
export type changeTransferGassLimitParam = {
    limit: string;
};
