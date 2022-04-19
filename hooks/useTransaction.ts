import {useAuth} from "../auth/useAccount";
import {
    Address,
    Balance,
    ChainID,
    GasLimit,
    IProvider,
    Transaction,
    TransactionPayload,
    TransactionStatus
} from "@elrondnetwork/erdjs/out";
import {chainId} from "../config";
import {
    TransactionNotificationStatus,
    useTransactionNotifications
} from "./useTransactionNotifications";
import {TransactionWatcher} from "@elrondnetwork/erdjs/out/transactionWatcher";

interface ITransactionData {
    data: string;
    receiverAddress: string;
    value: number;
    txReturnPath?: string
}

export const useTransaction = (onStatusChange: (status: TransactionStatus) => void) => {
    const {authConnector, authProviderType} = useAuth();
    const {pushTxNotification} = useTransactionNotifications();

    const makeTransaction = async (
        {data, value, receiverAddress, txReturnPath}: ITransactionData
    ): Promise<Transaction> => {
        if (!authConnector?.provider || !authConnector?.account) {
            throw new Error('AuthConnector is not set up. Make sure the user is logged in');
        }

        const account = authConnector.account;
        const provider = authConnector.provider;

        // todo: compute gas limit
        const tx = new Transaction({
            data: new TransactionPayload(data),
            gasLimit: new GasLimit(100000),
            receiver: new Address(receiverAddress),
            value: Balance.egld(value),
            chainID: new ChainID(chainId as string)
        });

        // account.nonce.increment();
        tx.setNonce(account.nonce);
        if (authProviderType === 'webwallet') {
            return provider.sendTransaction(tx, {
                callbackUrl: txReturnPath ?? window.location.toString()
            });
        }
        await provider.signTransaction(tx);
        const txHash = await authConnector.proxy.sendTransaction(tx);
        pushTxNotification(txHash.toString(), "new");

        try {
            const txWatcher = new TransactionWatcher(txHash, authConnector.proxy as IProvider);
            txWatcher.awaitExecuted(status => {
                pushTxNotification(
                    txHash.toString(),
                    status.toString() as TransactionNotificationStatus
                );
                onStatusChange(status);
            });
        } catch (e) {
            console.log(e);
        }

        return tx;

    };


    return {makeTransaction};
}
