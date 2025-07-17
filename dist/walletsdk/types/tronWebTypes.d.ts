export type tronWebInstance = {
    fullHost: String;
    headers?: {
        TRON_PRO_API_KEY: String;
    };
    privateKey: String;
};
export type tronWebProp = {
    provider_?: string | undefined;
    chain?: string;
    testnet?: boolean | undefined;
};
