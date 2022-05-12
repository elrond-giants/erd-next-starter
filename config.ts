export const network = {
    id: process.env.NEXT_PUBLIC_NETWORK_ID,
    name: process.env.NEXT_PUBLIC_NETWORK_NAME,
    walletAddress: process.env.NEXT_PUBLIC_NETWORK_WALLET_ADDRESS,
    apiAddress: process.env.NEXT_PUBLIC_NETWORK_API_ADDRESS,
    gatewayAddress: process.env.NEXT_PUBLIC_NETWORK_GATEWAY_ADDRESS,
    explorerAddress: process.env.NEXT_PUBLIC_NETWORK_EXPLORER_ADDRESS
};
export const walletConnectBridge = process.env.NEXT_PUBLIC_WALLET_CONNECT_BRIDGE;
export const walletConnectDeepLink = process.env.NEXT_PUBLIC_WALLET_CONNECT_DEEP_LINK;
export const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
export const denomination = process.env.NEXT_PUBLIC_DENOMINATION;
export const egldLabel = process.env.NEXT_PUBLIC_EGLD_LABEL ?? 'xEGLD';
