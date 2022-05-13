import type {NextPage} from 'next'
import RequiresAuth from "../components/RequiresAuth";
import {useAuth} from "../auth/useAccount";
import {egldLabel, network} from "../config";
import {useState} from "react";
import {useTransaction} from "../hooks/useTransaction";
import {webWalletTxReturnPath} from "../utils/routes";
import {denominate} from "../utils/economics";
import {TransactionHash, TransactionStatus} from "@elrondnetwork/erdjs/out";
import {getTotalTokensLeft} from "../utils/contractQueries";


const Home: NextPage = () => {
    const {address, authConnector, logout} = useAuth();
    const [receiverAddress, setReceiverAddress] = useState('');
    const [txData, setTxData] = useState('');
    const isDevEnv = network.id === 'devnet';
    const onStatusChange = (status: TransactionStatus, txHash: TransactionHash) => {
        console.log(status.toString(), txHash.toString());
    };

    const {makeTransaction} = useTransaction(onStatusChange);

    const sendTransaction = async () => {
        await makeTransaction({
            receiverAddress,
            data: txData,
            value: 0.1,
            txReturnPath: window.location.toString() + webWalletTxReturnPath,
        });

        setTxData('');
        setReceiverAddress('');

    };

    return (
        <RequiresAuth>
            <div className="flex justify-center w-full mt-20">
                <div className="flex flex-col items-start space-y-2 max-w-screen-md">
                    <h2 className="text-xl">Hello, Elrond Next Starter Kit!</h2>
                    <p>Address: {address}</p>
                    <p>
                        Balance: {denominate(authConnector?.account?.balance ?? 0) + egldLabel}
                    </p>
                    <button type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                                logout();
                            }}
                    >
                        Logout
                    </button>

                    {/*verify if env is dev or test*/}
                    {isDevEnv && <div className="pt-6 w-full">
                        <p>Make a devnet test transaction</p>
                        <form className="space-y-4 pt-6 w-full">
                            <div className="w-full">
                                <label htmlFor="email"
                                       className="block text-sm font-medium text-gray-700"
                                >
                                    Receiver Address
                                </label>
                                <input
                                    value={receiverAddress}
                                    onChange={event => {
                                        setReceiverAddress(event.target.value)
                                    }}
                                    type="text"
                                    name="address"
                                    className="mt-1 p-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"/>

                            </div>
                            <div className="w-full">
                                <label htmlFor="email"
                                       className="block text-sm font-medium text-gray-700"
                                >
                                    Transaction Data
                                </label>

                                <input
                                    value={txData}
                                    onChange={event => {
                                        setTxData(event.target.value)
                                    }}
                                    type="text"
                                    name="data"
                                    className="mt-1 p-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"/>

                            </div>
                            <button type="button"
                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        sendTransaction();
                                    }}
                            >
                                Sign devnet transaction
                            </button>
                        </form>
                    </div>
                    }
                </div>
            </div>
        </RequiresAuth>
    );
}

export default Home
