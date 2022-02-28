import AuthConnector from "./AuthConnector";
import {AuthProviderType} from "./types";
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {IDappProvider, WalletConnectProvider, WalletProvider} from "@elrondnetwork/erdjs/out";
import {getItem, setItem} from "../utils/localStorage";
import {useBuildConnector} from "./useBuildConnector";

const STORAGE_KEY = 'auth';
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
    const {buildConnector} = useBuildConnector();
    const [address, setAddress] = useState<string | null>(null);
    const [authConnector, setAuthConnector] = useState<AuthConnector | null>(null);
    const [authProviderType, setAuthProviderType] = useState(AuthProviderType.NONE);
    const [loggedIn, setLoggedIn] = useState(false);


    // Get auth info from storage and rebuild the auth connector if account is logged in
    useEffect(() => {
        if (loggedIn) {
            return;
        }
        const savedAuth = getItem(STORAGE_KEY);
        let _address = savedAuth?.address;
        let _providerType = savedAuth?.authProviderType ?? AuthProviderType.NONE;
        let _loggedIn = savedAuth?.loggedIn ?? false;

        if (_address && _providerType !== AuthProviderType.NONE && _loggedIn) {
            const _authConnector = buildConnector(_providerType);
            _authConnector.setAddress(_address);
            (async () => {
                await _authConnector.provider.init();
                await _authConnector.refreshAccount();
                setAuthConnector(_authConnector);
                setAddress(_address);
                setAuthProviderType(_providerType);
                setLoggedIn(true);
            })();
        }

    }, []);

    // Save auth info into storage
    useEffect(() => {
        setItem(STORAGE_KEY, {address, authProviderType, loggedIn})
    }, [address, authProviderType, loggedIn]);


    useEffect(() => {
        setLoggedIn(!!authConnector?.account);
    }, [authConnector]);

    const setConnector = (connector: AuthConnector | null) => {
        setAuthConnector(connector);
        setAuthProviderType(getProviderType(connector?.provider ?? null));
    };


    const value = useMemo(() => ({
        address,
        authConnector,
        authProviderType,
        loggedIn,
        setConnector,
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
            setConnector(null);
            setAddress(null);
        }
    }), [address, authProviderType, authConnector, loggedIn]);

    return <AuthContext.Provider value={value} {...props}/>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(`useAuth must be used within an AuthContextProvider.`);
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
