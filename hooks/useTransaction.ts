import {useAuth} from "../auth/useAccount";
import {
    Address,
    Balance,
    ChainID,
    GasLimit,
    IDappProvider,
    IProvider,
    Transaction, TransactionHash,
    TransactionPayload,
    TransactionStatus
} from "@elrondnetwork/erdjs/out";
import {chainId} from "../config";
import {
    TransactionNotificationStatus,
    useTransactionNotifications
} from "./useTransactionNotifications";
import {TransactionWatcher} from "@elrondnetwork/erdjs/out/transactionWatcher";
import {estimateGasLimit} from "../utils/economics";

interface ITransactionData {
    data: string | TransactionPayload;
    receiverAddress: string;
    value: number;
    gasLimit?: number;
    txReturnPath?: string
}

export const useTransaction = (
    onStatusChange: (status: TransactionStatus, txHash: TransactionHash) => void
) => {
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
        const payload = data instanceof TransactionPayload ? data : new TransactionPayload(data);

        let _gasLimit = gasLimit;
        if (_gasLimit === undefined) {
            _gasLimit = await estimateGasLimit(payload);
        }

        const tx = new Transaction({
            data: payload,
            gasLimit: new GasLimit(_gasLimit),
            receiver: new Address(receiverAddress),
            value: Balance.egld(value),
            chainID: new ChainID(chainId as string)
        });

        tx.setNonce(account.nonce);
        if (authProviderType === 'webwallet') {
            return provider.sendTransaction(tx, {
                callbackUrl: txReturnPath ?? window.location.toString()
            });
        }
        const signedTx = await signTransaction(tx, provider);
        if (!signedTx) {
            return null;
        }
        const txHash = await authConnector.proxy.sendTransaction(signedTx);
        pushTxNotification(txHash.toString(), "new");

        try {
            const txWatcher = new TransactionWatcher(txHash, authConnector.proxy as IProvider);
            await txWatcher.awaitExecuted(status => {
                pushTxNotification(
                    txHash.toString(),
                    status.toString() as TransactionNotificationStatus
                );
                onStatusChange(status, txHash);
                if (status.isSuccessful()) {
                    authConnector.refreshAccount();
                }
            });
        } catch (e) {
            pushTxNotification(txHash.toString(), "invalid");
        }

        return tx;

    };

    const signTransaction = async (
        tx: Transaction,
        provider: IDappProvider
    ): Promise<Transaction | null> => {
        // Show sign notification
        const notificationId = pushSignTransactionNotification({
            title: "Sign Transaction",
            body: "Check your device to sign the transaction.",
        });

        try {
            return await provider.signTransaction(tx);
        } catch (e) {
            return null;
        } finally {
            removeNotification(notificationId);
        }
    };

    return {makeTransaction};
}
