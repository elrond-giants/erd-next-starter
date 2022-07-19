import {INotificationProps, NotificationType} from "../components/Notification";
import {
    removeNotification as _removeNotification,
    upsertNotification
} from "../redux/slices/notificationsSlice";
import {useAppDispatch} from "./useStore";
import {nanoid} from "nanoid";

export type TransactionNotificationStatus = "new" | "success" | "pending" | "invalid" | "failed";

const getTitle = (status: TransactionNotificationStatus): string => {
    switch (status) {
        case "new":
            return "Transaction submitted"
        case "pending":
            return "Transaction pending"
        case "invalid":
            return "Invalid transaction"
        case "failed":
            return "Transaction failed";
        case "success":
            return "Transaction succeeded"
        default:
            return "Unknown transaction status"
    }

};
const getType = (status: TransactionNotificationStatus): NotificationType => {
    switch (status) {
        case "pending":
            return NotificationType.WARNING;
        case "invalid":
        case "failed":
            return NotificationType.ERROR;
        case "success":
            return NotificationType.SUCCESS;
        default:
            return NotificationType.INFO;
    }
}

export function useTransactionNotifications() {
    const dispatch = useAppDispatch();
    const pushTxNotification = (transactionHash: string, status: TransactionNotificationStatus) => {
        const notification: INotificationProps = {
            id: transactionHash,
            title: getTitle(status),
            body: transactionHash,
            type: getType(status),
            dismissible: (status === "success" || status === "invalid" || status === "failed")
        };

        dispatch(upsertNotification(notification));
    }

    const pushSignTransactionNotification = (
        {
            title,
            body
        }: { title: string; body: string }
    ): string => {
        const id = nanoid(10);
        const notification: INotificationProps = {
            id,
            title,
            body,
            type: NotificationType.INFO,
            dismissible: false,
        };

        dispatch(upsertNotification(notification));

        return id;
    };

    const removeNotification = (id: string) => {
        dispatch(_removeNotification(id));
    };

    return {pushTxNotification, pushSignTransactionNotification, removeNotification};
}
