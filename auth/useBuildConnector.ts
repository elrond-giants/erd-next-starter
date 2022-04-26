import AuthConnector from "./AuthConnector";
import {network, walletConnectBridge} from "../config";
import {useAuth} from "./useAccount";
import {AuthProviderType, IAuthProviderConfig} from "./types";
import {
    ExtensionProvider,
    ProxyProvider,
    WalletConnectProvider,
    WalletProvider
} from "@elrondnetwork/erdjs/out";

export function useBuildConnector() {
    const {setConnector, setAddress, logout} = useAuth();
    const config: IAuthProviderConfig = {
        network,
        walletConnectBridge
    };
    const buildMaiarConnector = (): AuthConnector => {
        let connector: AuthConnector;
        const proxy = new ProxyProvider(<string>config.network.gatewayAddress);
        const handlers = {
            onClientLogin: async () => {
                const address = await connector.provider.getAddress();
                connector.setAddress(address)
                await connector.refreshAccount();
                setConnector(connector);
                setAddress(address);
            },
            onClientLogout: () => {
                logout();
            }
        };

        const provider = new WalletConnectProvider(proxy, config.walletConnectBridge, handlers);
        connector = new AuthConnector(provider, proxy, config);

        return connector;
    };

    const buildWebConnector = (): AuthConnector => {
        const provider = new WalletProvider(config.network.walletAddress);
        const proxy = new ProxyProvider(<string>config.network.gatewayAddress);

        return new AuthConnector(provider, proxy, config);

    };

    const buildExtensionConnector = async (): Promise<AuthConnector> => {
        const provider = ExtensionProvider.getInstance();
        const initialised = await provider.init();
        if (!initialised) {
            throw new Error('Extension not available.');
        }
        const proxy = new ProxyProvider(<string>config.network.gatewayAddress);

        return new AuthConnector(provider, proxy, config);
    }

    const buildConnector = async (type: AuthProviderType): Promise<AuthConnector> => {
        switch (type) {
            case AuthProviderType.MAIAR:
                return buildMaiarConnector();
            case AuthProviderType.WEBWALLET:
                return buildWebConnector();
            case AuthProviderType.EXTENSION:
                return buildExtensionConnector();
            default:
                throw new Error(`Invalid provider type. Cannot build connector for provider '${type}'`);
        }
    };

    return {buildMaiarConnector, buildWebConnector, buildExtensionConnector, buildConnector};
}
