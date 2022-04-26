import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect} from "react";
import AuthConnector from "../auth/AuthConnector";
import * as config from "../config";
import {useAuth} from "../auth/useAccount";
import {homePath} from "../utils/routes";
import {useBuildConnector} from "../auth/useBuildConnector";


const WebAuth: NextPage = () => {
    const router = useRouter();
    const {setConnector, setAddress, loggedIn} = useAuth();
    const {buildWebConnector} = useBuildConnector();
    useEffect(() => {
        if (loggedIn) {
            (async () => {
                await router.replace(homePath);
            })();
        }

        if (!router.isReady) {
            return;
        }
        const {address} = router.query;
        const webConnector = buildWebConnector();
        webConnector.setAddress(address as string);

        (async () => {
            await webConnector.refreshAccount();
            setConnector(webConnector);
            setAddress(address as string);
        })();


    }, [router.isReady, router.asPath, loggedIn])
    return (
        <>
            <div>Loading</div>
        </>
    );
}

export default WebAuth
