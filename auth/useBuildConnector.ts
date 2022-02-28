import AuthConnector from "./AuthConnector";
import {network, walletConnectBridge} from "../config";
import {useAuth} from "./useAccount";
import {AuthProviderType, IAuthProviderConfig} from "./types";

export function useBuildConnector() {
    const {setConnector, setAddress, logout} = useAuth();
    const config: IAuthProviderConfig = {
        network,
        walletConnectBridge
    };
    const buildMaiarConnector = (): AuthConnector => {
        const connector = AuthConnector.buildMaiarConnector(config, {
            loginHandler: async () => {
                const address = await connector.provider.getAddress();
                connector.setAddress(address)
                await connector.refreshAccount();
                setConnector(connector);
                setAddress(address);
            },
            logoutHandler: () => {
                logout();
            }
        });

        return connector;
    };

    const buildWebConnector = (): AuthConnector => {
        return AuthConnector.buildWebConnector(config);
    };

    const buildConnector = (type: AuthProviderType): AuthConnector => {
        switch (type) {
            case AuthProviderType.MAIAR:
                return buildMaiarConnector();
            case AuthProviderType.WEBWALLET:
                return buildWebConnector();
            default:
                throw new Error(`Invalid provider type. Cannot build connector for provider '${type}'`);
        }
    };

    return {buildMaiarConnector, buildWebConnector, buildConnector};
}
