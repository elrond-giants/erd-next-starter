import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {homePath} from "../utils/routes";
import {useRouter} from "next/router";
import WalletConnectLoginPopup from "../components/WalletConnectLoginPopup";
import {useAuth} from "@elrond-giants/erd-react-hooks";
import {AuthProviderType} from "@elrond-giants/erdjs-auth/dist/types";
import * as config from "../config";
import QRCode from 'qrcode';


const Auth: NextPage = () => {
    const {authenticated, login, getLedgerAccounts} = useAuth();
    const router = useRouter();
    const [maiarAuthUri, setMaiarAuthUri] = useState('');
    const [authQrCode, setAuthQrCode] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [ledgerAccounts, setLedgerAccounts] = useState<string[]>([]);

    useEffect(() => {
        setShowPopup(!!(authQrCode && isPopupOpen));
    }, [authQrCode, isPopupOpen])

    useEffect(() => {
        if (!authenticated) {
            return;
        }

        (async () => {
            await router.replace(homePath);
        })();

    }, [router, authenticated]);

    const maiarClickHandler = async () => {
        const uri = await login(AuthProviderType.WALLET_CONNECT);
        const qrCode = await QRCode.toString(uri, {type: "svg"});
        const authUri = `${config.walletConnectDeepLink}?wallet-connect=${encodeURIComponent(uri)}`;
        setAuthQrCode(qrCode);
        setMaiarAuthUri(authUri);
        setIsPopupOpen(true);
    };

    const webClickHandler = async () => {
        await login(AuthProviderType.WEBWALLET);
    };

    const extensionClickHandler = async () => {
        await login(AuthProviderType.EXTENSION);
    }

    const ledgerClickHandler = async () => {
        const accounts = await getLedgerAccounts();
        setLedgerAccounts(accounts);
    }

    const loginWithLedger = async (accountIndex: number) => {
        await login(AuthProviderType.LEDGER, {ledgerAccountIndex: accountIndex});
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center space-y-4 min-h-half-screen">
                <h3 className="text-4xl">
                    Connect your wallet
                </h3>
                <p className="text-2xl">Pick a login method</p>
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-800 bg-blue-300 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        onClick={maiarClickHandler}
                    >
                        xPortal
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-800 bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
                        onClick={webClickHandler}
                    >
                        Web Wallet
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-800 bg-green-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
                        onClick={extensionClickHandler}
                    >
                        Extension
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-800 bg-orange-300 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
                        onClick={ledgerClickHandler}
                    >
                        Ledger
                    </button>
                </div>
                {ledgerAccounts.length > 0 && <div className="flex items-center">
                    <span>Select ledger account</span>
                    <select
                        className="m-10"
                        onChange={(e) => loginWithLedger(parseInt(e.target.value))}
                    >
                        {ledgerAccounts.map((account, index) => (
                            <option key={account} value={index}>{account}</option>
                        ))}
                    </select>
                </div>
                }
            </div>
            <WalletConnectLoginPopup
                qrCode={authQrCode}
                uri={maiarAuthUri}
                open={showPopup}
                setOpen={setIsPopupOpen}
            />
        </>
    );
}

export default Auth
