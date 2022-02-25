import '../styles/globals.css'
import type {AppProps} from 'next/app'
import store from "../redux/store";
import {Provider as ReduxProvider} from "react-redux";
import {AuthContextProvider} from "../auth/useAccount";
import Notifications from "../components/Notifications";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <ReduxProvider store={store}>
            <AuthContextProvider>
                <Component {...pageProps} />
                <Notifications/>
            </AuthContextProvider>
        </ReduxProvider>
    );
}

export default MyApp
