import {
    AccountOnNetwork,
    Address,
    IDappProvider,
    ProxyProvider,
    WalletConnectProvider,
    WalletProvider,
    ExtensionProvider
} from "@elrondnetwork/erdjs";
import {IAuthHandler, IAuthProviderConfig} from "./types";
import {Nonce} from "@elrondnetwork/erdjs/out";


export default class AuthConnector {
    private _provider: IDappProvider;
    private _config: IAuthProviderConfig;
    private _proxy: ProxyProvider;
    private _address: Address | undefined;
    private _account: AccountOnNetwork | undefined;

    constructor(
        provider: IDappProvider,
        proxy: ProxyProvider,
        config: IAuthProviderConfig
    ) {
        this._provider = provider;
        this._proxy = proxy;
        this._config = config;
    }


    get provider(): IDappProvider {
        return this._provider;
    }

    get proxy(): ProxyProvider {
        return this._proxy;
    }

    get address(): Address | undefined {
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

        return <AccountOnNetwork>this._account;
    }


    setAddress(address: string | Address): AuthConnector {
        if (address instanceof Address) {
            this._address = address;
        } else {
            this._address = new Address(address);
        }

        this.setProviderAddress();

        return this;
    }


    private async loadAccount() {
        if (this._address !== undefined) {
            this._account = await this._proxy.getAccount(this._address);
        }
    }

    private setProviderAddress() {
        if (this.provider instanceof ExtensionProvider && this._address !== undefined) {
            this.provider.setAddress(this._address.toString());
        }
    }

}
