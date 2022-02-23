import {
    AccountOnNetwork,
    Address,
    IDappProvider,
    ProxyProvider,
    WalletConnectProvider,
    WalletProvider
} from "@elrondnetwork/erdjs/out";
import {IAuthHandler, IAuthProviderConfig} from "./types";


export default class AuthConnector {
    private _provider: IDappProvider;
    private _config: IAuthProviderConfig;
    private _proxy: ProxyProvider;
    private _address: Address;
    private _account: AccountOnNetwork;

    constructor(
        provider: IDappProvider,
        proxy: ProxyProvider,
        config: IAuthProviderConfig
    ) {
        this._provider = provider;
        this._proxy = proxy;
        this._config = config;
    }

    static buildMaiarConnector(
        config: IAuthProviderConfig,
        {loginHandler, logoutHandler}: IAuthHandler
    ) {
        const proxy = new ProxyProvider(config.network.gatewayAddress);
        const provider = new WalletConnectProvider(proxy, config.walletConnectBridge, {
            onClientLogin: loginHandler,
            onClientLogout: logoutHandler
        });

        return new AuthConnector(provider, proxy, config);
    }

    static buildWebConnector(config: IAuthProviderConfig) {
        const provider = new WalletProvider(config.network.walletAddress);
        const proxy = new ProxyProvider(config.network.gatewayAddress);

        return new AuthConnector(provider, proxy, config);
    }

    get provider(): IDappProvider {
        return this._provider;
    }

    get proxy(): ProxyProvider {
        return this._proxy;
    }

    get address(): Address {
        return this._address;
    }

    get account(): AccountOnNetwork | undefined {
        return this._account;
    }

    async refreshAccount(): Promise<AccountOnNetwork> {
        if (this._address === undefined) {
            throw new Error('No account address was set.');
        }

        await this.loadAccount();

        return this._account;
    }


    setAddress(address: string | Address): AuthConnector {
        if (address instanceof Address) {
            this._address = address;
        } else {
            this._address = new Address(address);
        }

        // this.loadAccount();

        return this;
    }


    private async loadAccount() {
        this._account = await this._proxy.getAccount(this._address);
    }

}
