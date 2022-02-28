export interface IAuthProviderConfig {
    walletConnectBridge: string | undefined;
    network: {
        [key: string]: string | undefined;
    }
}

export interface IAuthHandler {
    loginHandler: () => void,
    logoutHandler: () => void
}

export enum AuthProviderType {
    MAIAR = 'maiar',
    WEBWALLET = 'webwallet',
    NONE = "none"
}
