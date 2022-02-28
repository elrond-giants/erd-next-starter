import AuthConnector from "../auth/AuthConnector";
import * as config from "../config";
// @ts-ignore
import QRCode from 'qrcode';
import {useAuth} from "../auth/useAccount";
import {useBuildConnector} from "../auth/useBuildConnector";

export function useLogin() {
    // @ts-ignore
    const {setConnector} = useAuth();
    const {buildWebConnector, buildMaiarConnector} = useBuildConnector();
    const initMaiarLogin = async () => {
        const maiarConnector = buildMaiarConnector();

        const uri = await maiarConnector.provider.login();
        const qrCode = await QRCode.toString(uri, {type: 'svg'});
        const authUri = `${config.walletConnectDeepLink}?wallet-connect=${encodeURIComponent(uri)}`

        return [authUri, qrCode];
    };

    const initWebWalletLogin = async (returnUrl: string) => {
        const webConnector = buildWebConnector();
        setConnector(webConnector);

        return webConnector.provider.login({callbackUrl: returnUrl});

    }

    return {initMaiarLogin, initWebWalletLogin}
}
