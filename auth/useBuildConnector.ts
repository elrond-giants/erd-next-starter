import AuthConnector from "./AuthConnector";
import {network, walletConnectBridge} from "../config";
import {useAuth} from "./useAccount";
import {AuthProviderType} from "./types";
import {
    ExtensionProvider,
    ProxyProvider,
    WalletConnectProvider,
    WalletProvider
} from "@elrondnetwork/erdjs/out";

export function useBuildConnector() {
    const {setConnector, setAddress, logout} = useAuth();
    const buildMaiarConnector = (): AuthConnector => {
        let connector: AuthConnector;
        const proxy = new ProxyProvider(<string>network.gatewayAddress);
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

        const provider = new WalletConnectProvider(proxy, walletConnectBridge, handlers);
        connector = new AuthConnector(provider, proxy);

        return connector;
    };

    const buildWebConnector = (): AuthConnector => {
        const provider = new WalletProvider(network.walletAddress);
        const proxy = new ProxyProvider(<string>network.gatewayAddress);

        return new AuthConnector(provider, proxy);

    };

    const buildExtensionConnector = async (): Promise<AuthConnector> => {
        const provider = ExtensionProvider.getInstance();
        const initialised = await provider.init();
        if (!initialised) {
            throw new Error('Extension not available.');
        }
        const proxy = new ProxyProvider(<string>network.gatewayAddress);

        return new AuthConnector(provider, proxy);
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
