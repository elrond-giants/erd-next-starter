import {Transition} from '@headlessui/react'
import {Fragment} from "react";
import {classNames} from "../utils/presentation";


export enum NotificationType {
    SUCCESS,
    INFO,
    WARNING,
    ERROR,
}


export interface INotificationProps {
    id: string;
    title: string;
    body: string;
    dismissible?: boolean,
    type?: NotificationType;
}

const getBgColor = (type: NotificationType | undefined) => {
    switch (type) {
        case NotificationType.SUCCESS:
            return 'bg-green-500';
        case NotificationType.WARNING:
            return 'bg-yellow-400';
        case NotificationType.ERROR:
            return 'bg-red-500';
        default:
            return 'bg-gray-300';
    }
}

export default function Notification(
    {id, title, body, dismissible = true, type = NotificationType.INFO}: INotificationProps,
    dismissNotification: (id: string) => void
) {
    const color = getBgColor(type);

    return (
        <Transition
            key={id}
            show={true}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div
                className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className={classNames("w-4 h-4 mt-1 rounded-full", color)}/>
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900">{title}</p>
                            <p className="mt-1 text-sm text-gray-500 break-all">{body}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            {dismissible && <button
                                className="bg-white rounded-full w-4 h-4 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => {
                                    dismissNotification(id);
                                }}
                            >
                                <span className="sr-only">Close</span>
                                <span className="">x</span>
                            </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
};
