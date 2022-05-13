import type {NextPage} from 'next'
import {useLogin} from "../hooks/useLogin";
import {useEffect, useState} from "react";
import {homePath, webLoginRedirectPath} from "../utils/routes";
import {useAuth} from "../auth/useAccount";
import {useRouter} from "next/router";
import MaiarLoginPopup from "../components/MaiarLoginPopup";


const Auth: NextPage = () => {
    const {loggedIn} = useAuth();
    const router = useRouter();
    const {
        initMaiarLogin,
        initWebWalletLogin,
        initExtensionLogin
    } = useLogin();
    const [maiarAuthUri, setMaiarAuthUri] = useState('');
    const [authQrCode, setAuthQrCode] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        setShowPopup(!!(authQrCode && isPopupOpen));
    }, [authQrCode, isPopupOpen])

    useEffect(() => {
        if (!loggedIn) {
            return;
        }

        (async () => {
            await router.replace(homePath);
        })();

    }, [router, loggedIn]);

    const maiarClickHandler = async () => {
        const [authUri, qrCode] = await initMaiarLogin();
        setAuthQrCode(qrCode);
        setMaiarAuthUri(authUri);
        setIsPopupOpen(true);
    };

    const webClickHandler = async () => {
        await initWebWalletLogin(window.location.origin + webLoginRedirectPath);
    };

    const extensionClickHandler = async () => {
        await initExtensionLogin();
        await router.replace(homePath);
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
                        Maiar
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
                </div>
            </div>
            <MaiarLoginPopup qrCode={authQrCode} uri={maiarAuthUri} open={showPopup}
                             setOpen={setIsPopupOpen}/>
        </>
    );
}

export default Auth
