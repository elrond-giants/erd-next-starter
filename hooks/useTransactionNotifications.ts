import {INotificationProps, NotificationType} from "../components/Notification";
import {addNotification} from "../redux/slices/notificationsSlice";
import {useAppDispatch} from "./useStore";

export type TransactionNotificationStatus = 'new' | 'success' | 'pending' | 'invalid';

const getTitle = (status: TransactionNotificationStatus): string => {
    switch (status) {
        case "new":
            return 'Transaction submitted';
        case "pending":
            return 'Transaction pending';
        case "invalid":
            return 'Invalid transaction';
        case "success":
            return 'Transaction succeeded';
        default:
            return 'Unknown transaction status';
    }

};
const getType = (status: TransactionNotificationStatus): NotificationType => {
    switch (status) {
        case "pending":
            return NotificationType.WARNING;
        case "invalid":
            return NotificationType.ERROR;
        case "success":
            return NotificationType.SUCCESS;
        default:
            return NotificationType.INFO;
    }
}

export function useTransactionNotifications() {
    const dispatch = useAppDispatch();
    const addTxNotification = (transactionHash: string, status: TransactionNotificationStatus) => {
        const notification: INotificationProps = {
            id: transactionHash,
            title: getTitle(status),
            body: transactionHash,
            type: getType(status),
        };

        dispatch(addNotification(notification));
    }

    return {addTxNotification};
}
