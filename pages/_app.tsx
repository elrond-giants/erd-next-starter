import '../styles/globals.css'
import type {AppProps} from 'next/app'
import store from "../redux/store";
import {Provider as ReduxProvider} from "react-redux";
import Notifications from "../components/Notifications";
import {AuthContextProvider} from "@elrond-giants/erd-react-hooks";
import ProviderBuilder from "@elrond-giants/erd-react-hooks/dist/useAuth/ProviderBuilder";
import {MaiarProvider} from "@elrond-giants/erdjs-auth/dist";
import {WalletConnectProvider} from "@elrondnetwork/erdjs-wallet-connect-provider/out";
import AuthConnector from "@elrond-giants/erd-react-hooks/dist/useAuth/AuthConnector";

class MyProviderBuilder extends ProviderBuilder {
    // For now, in order to set the walletConnectBridge, we need to
    // manually build the Maiar provider.
    // This will be fixed in the next version of the library.

    protected buildMaiarProvider() {
        let maiarProvider: MaiarProvider;
        const onChange = () => {
            if (maiarProvider.onChange) {
                maiarProvider.onChange();
            }
        }

        const provider = new WalletConnectProvider("bridgeURL-here", {
            onClientLogin: onChange,
            onClientLogout: onChange
        });


        maiarProvider = new MaiarProvider(provider);

        return maiarProvider;
    }
}

function MyApp({Component, pageProps}: AppProps) {
    const env = "devnet";
    const providerBuilder = new MyProviderBuilder(env);
    const authConnector = new AuthConnector(providerBuilder);

    return (
        <ReduxProvider store={store}>
            <AuthContextProvider env={env} connector={authConnector}>
                <Component {...pageProps} />
                <Notifications/>
            </AuthContextProvider>
        </ReduxProvider>
    );
}

export default MyApp
