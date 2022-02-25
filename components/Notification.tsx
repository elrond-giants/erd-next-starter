import {Transition} from '@headlessui/react'
import {Fragment} from "react";

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
    type?: NotificationType;
    onDismiss?: (id: string) => void;
}

export default function Notification({id, title, body, onDismiss, type}: INotificationProps) {

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
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900">{title}</p>
                            <p className="mt-1 text-sm text-gray-500">{body}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            {onDismiss && <button
                                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => {
                                    onDismiss(id);
                                }}
                            >
                                <span className="sr-only">Close</span>
                                X
                            </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
};
