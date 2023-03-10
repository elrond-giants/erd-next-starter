import '../styles/globals.css'
import type {AppProps} from 'next/app'
import store from "../redux/store";
import {Provider as ReduxProvider} from "react-redux";
import Notifications from "../components/Notifications";
import {AuthContextProvider} from "@elrond-giants/erd-react-hooks";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <ReduxProvider store={store}>
            <AuthContextProvider
                env={process.env.NODE_ENV === "production" ? "mainnet" : "devnet"}
                projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_ID}
            >
                <Component {...pageProps} />
                <Notifications/>
            </AuthContextProvider>
        </ReduxProvider>
    );
}

export default MyApp
