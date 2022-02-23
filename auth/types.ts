export interface IAuthProviderConfig {
    walletConnectBridge: string;
    network: {
        [key: string]: string;
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
