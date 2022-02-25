import AuthConnector from "./AuthConnector";
import {AuthProviderType} from "./types";
import {createContext, ReactPropTypes, useContext, useEffect, useState} from "react";
import {IDappProvider, WalletConnectProvider, WalletProvider} from "@elrondnetwork/erdjs/out";


const accountContextDefaultValue: {
    address: string | null,
    authConnector: AuthConnector | null,
    authProviderType: AuthProviderType,
    loggedIn: boolean,
    setConnector: (connector: AuthConnector) => void,
    setAddress: (address: string) => void,
    logout: () => void
} = {
    address: null,
    authConnector: null,
    authProviderType: AuthProviderType.NONE,
    loggedIn: false,
    setConnector: (connector: AuthConnector) => {
    },
    setAddress: (address: string) => {
    },
    logout: () => {
    }
};

export const AuthContext = createContext(accountContextDefaultValue);

// @ts-ignore
export const AuthContextProvider = (props) => {
    const [address, setAddress] = useState<string | null>(null);
    const [authConnector, setAuthConnector] = useState<AuthConnector | null>(null);
    const [authProviderType, setAuthProviderType] = useState(AuthProviderType.NONE);
    const [loggedIn, setLoggedIn] = useState(false);

    // todo: save and retrieve from local storage

    useEffect(() => {
        setLoggedIn(!!authConnector?.account);
    }, [authConnector])


    const value = {
        address,
        authConnector,
        authProviderType,
        loggedIn,
        setConnector: (connector: AuthConnector | null) => {
            setAuthConnector(connector);
            setAuthProviderType(getProviderType(connector?.provider ?? null));
        },
        setAddress: async (address: string | null) => {
            setAddress(address);
            if (address && authConnector) {
                authConnector.setAddress(address);
                await authConnector.refreshAccount();
            }
        },
        logout: () => {
            if (loggedIn) {
                authConnector?.provider.logout();
            }
            setAuthConnector(null);
            setAddress(null);
        }
    };

    return <AuthContext.Provider value={value} {...props}/>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(`useAuth must be used within a AuthContextProvider.`);
    }
    return context;
}

const getProviderType = (provider: IDappProvider | null) => {
    if (provider instanceof WalletProvider) {
        return AuthProviderType.WEBWALLET;
    }

    if (provider instanceof WalletConnectProvider) {
        return AuthProviderType.MAIAR;
    }

    return AuthProviderType.NONE;

}
