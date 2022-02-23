import AuthConnector from "../auth/AuthConnector";
import * as config from "../config";
// @ts-ignore
import QRCode from 'qrcode';

import {AuthContext, useAuth} from "../auth/useAccount";

export function useLogin() {
    // @ts-ignore
    const {setConnector, setAddress, logout, authConnector, authProviderType} = useAuth();
    const initMaiarLogin = async () => {
        const maiarConnector = AuthConnector.buildMaiarConnector(config, {
            loginHandler: async () => {
                const address = await maiarConnector.provider.getAddress();
                maiarConnector.setAddress(address)
                await maiarConnector.refreshAccount();
                setConnector(maiarConnector);
                setAddress(address);
            },
            logoutHandler: () => {
                logout();
                console.log('log out')
            }
        });


        const authUri = await maiarConnector.provider.login();
        const qrCode = await QRCode.toString(authUri, {type: 'svg'})

        return [authUri, qrCode];
    };

    const initWebWalletLogin = async (returnUrl: string) => {
        const webConnector = AuthConnector.buildWebConnector(config);
        setConnector(webConnector);

        console.log(authConnector, authProviderType)

        return webConnector.provider.login({callbackUrl: returnUrl});

    }

    return {initMaiarLogin, initWebWalletLogin}
}
