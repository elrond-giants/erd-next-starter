import type {NextPage} from 'next'
import RequiresAuth from "../components/RequiresAuth";
import {useAuth} from "../auth/useAccount";
import {
    Address,
    Balance,
    ChainID,
    GasLimit,
    IProvider,
    Transaction,
    TransactionPayload
} from "@elrondnetwork/erdjs/out";
import {chainId} from "../config";
import {useState} from "react";
import {TransactionWatcher} from "@elrondnetwork/erdjs/out/transactionWatcher";


const Home: NextPage = () => {
    const {address, authConnector, logout} = useAuth();
    const handleLogout = () => {
        logout();
    };
    const [receiverAddress, setReceiverAddress] = useState('');
    const [txData, setTxData] = useState('');

    const makeTransaction = async () => {
        const account = authConnector?.account;
        // @ts-ignore
        const provider = authConnector.provider;
        const tx = new Transaction({
            data: new TransactionPayload(txData),
            gasLimit: new GasLimit(100000),
            receiver: new Address(receiverAddress),
            value: Balance.egld(1),
            chainID: new ChainID(chainId)
        });
        // @ts-ignore
        tx.setNonce(account.nonce);
        try {
            const signedTransaction = await provider.signTransaction(tx);
            console.log(signedTransaction);
            const result = await tx.send(authConnector?.proxy as IProvider);
            console.log(result);

        } catch (e) {
            console.log(e);

        }

        const txWatcher = new TransactionWatcher(tx.getHash(), provider);
    };

    return (
        <RequiresAuth>
            <div className="flex justify-center w-full mt-20">
                <div className="flex flex-col items-start space-y-2 max-w-screen-md">
                    <h2 className="text-xl">Hello, Elrond Next Starter Kit!</h2>
                    <p>Address: {address}</p>
                    <p>Ballance: {authConnector?.account?.balance.toString()}</p>
                    <button type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleLogout}
                    >
                        Logout
                    </button>


                    {/*verify if env is dev or test*/}
                    <div className="pt-6 w-full">
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
                                        makeTransaction();
                                    }}
                            >
                                Sign devnet transaction
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </RequiresAuth>
    );
}

export default Home
