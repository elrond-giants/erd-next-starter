import {useAuth} from "../auth/useAccount";
import {
    Address,
    Balance,
    ChainID,
    GasLimit, IDappProvider,
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
import {nanoid} from "nanoid";
import {Signature} from "@elrondnetwork/erdjs/out/signature";
import {estimateGasLimit} from "../utils/economics";

interface ITransactionData {
    data: string;
    receiverAddress: string;
    value: number;
    gasLimit?: number;
    txReturnPath?: string
}

export const useTransaction = (onStatusChange: (status: TransactionStatus) => void) => {
    const {authConnector, authProviderType} = useAuth();
    const {
        pushTxNotification,
        pushSignTransactionNotification,
        removeNotification
    } = useTransactionNotifications();

    const makeTransaction = async (
        {data, value, receiverAddress, gasLimit, txReturnPath}: ITransactionData
    ): Promise<Transaction | null> => {
        if (!authConnector?.provider || !authConnector?.account) {
            throw new Error('AuthConnector is not set up. Make sure the user is logged in');
        }

        const account = authConnector.account;
        const provider = authConnector.provider;

        let _gasLimit = gasLimit;
        if (_gasLimit === undefined) {
            _gasLimit = await estimateGasLimit(data);
        }
        const tx = new Transaction({
            data: new TransactionPayload(data),
            gasLimit: new GasLimit(_gasLimit),
            receiver: new Address(receiverAddress),
            value: Balance.egld(value),
            chainID: new ChainID(chainId as string)
        });

        tx.setNonce(account.nonce.increment());
        if (authProviderType === 'webwallet') {
            return provider.sendTransaction(tx, {
                callbackUrl: txReturnPath ?? window.location.toString()
            });
        }
        const signature = await signTransaction(tx, provider);
        if (!signature) {
            return null;
        }
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

    const signTransaction = async (
        tx: Transaction,
        provider: IDappProvider
    ): Promise<Signature | null> => {
        // Show sign notification
        const notificationId = nanoid(10);
        pushSignTransactionNotification({
            id: notificationId,
            title: "Sign Transaction",
            body: "Check your device to sign the transaction.",
        });
        try {
            const signedTx = await provider.signTransaction(tx);

            return signedTx.getSignature();
        } catch (e) {
            return null;
        } finally {
            removeNotification(notificationId);
        }
    };


    return {makeTransaction};
}
