import {useEffect, useState} from "react";
import Notification from "./Notification";
import {useAppSelector} from "../hooks/useStore";



export default function Notifications() {
    const notifications = useAppSelector(state => state.notifications.value);

    return (
        <>
            <div
                aria-live="assertive"
                className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
            >
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {notifications.map(notification => {
                        return Notification(notification);
                    })}
                </div>
            </div>
        </>
    )
}
;
