import '../styles/globals.css'
import type {AppProps} from 'next/app'
import store from "../redux/store";
import {Provider as ReduxProvider} from "react-redux";
import {AuthContextProvider} from "../auth/useAccount";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <ReduxProvider store={store}>
            <AuthContextProvider>
                <Component {...pageProps} />
            </AuthContextProvider>
        </ReduxProvider>
    );
}

export default MyApp
