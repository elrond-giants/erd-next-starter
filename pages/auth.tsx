import type {NextPage} from 'next'
import {useLogin} from "../hooks/useLogin";
import {useEffect, useState} from "react";
import {homePath, webLoginRedirectPath} from "../utils/routes";
import {useAuth} from "../auth/useAccount";
import {useRouter} from "next/router";


const Auth: NextPage = () => {
    const {loggedIn, address} = useAuth();
    const router = useRouter();
    const {initMaiarLogin, initWebWalletLogin} = useLogin();
    const [maiarAuthUri, setMaiarAuthUri] = useState(null);
    const [authQrCode, setAuthQrCode] = useState('');

    useEffect(() => {
        if (!loggedIn) {
            return;
        }

        (async () => {
            await router.replace(homePath);
        })();

    }, [router,loggedIn]);

    const maiarClickHandler = async () => {
        const [authUri, qrCode] = await initMaiarLogin();
        setAuthQrCode(qrCode);
        setMaiarAuthUri(authUri);
    };

    const webClickHandler = async () => {
        await initWebWalletLogin(window.location.origin + webLoginRedirectPath);
    };

    return (
        <>
            <div>Hello, Elrond Next Starter Kit!</div>
            <button onClick={maiarClickHandler}>Maiar Log In</button>
            <button onClick={webClickHandler}>Web Log In</button>
            {authQrCode && <div
                style={{width: '200px', height: '200px'}}
                dangerouslySetInnerHTML={{__html: authQrCode}}
            />}
        </>
    );
}

export default Auth
