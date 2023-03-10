import Popup from "./shared/Dialog";
import {Dialog} from "@headlessui/react";


interface PopupProps {
    qrCode: string,
    uri: string,
    open: boolean,
    setOpen: (open: boolean) => void
}

export default function WalletConnectLoginPopup({qrCode, uri, open, setOpen}: PopupProps) {
    const platform = require("platform");
    const isMobile = platform?.os?.family === 'iOS' || platform?.os?.family === 'Android';

    return (
        <Popup open={open} setOpen={setOpen}>
            <div className="flex flex-col items-center">
                <Dialog.Title
                    as="h3"
                    className="text-xl"
                >
                    Login with xPortal
                </Dialog.Title>
                <div
                    className="w-60 h-60 mt-6"
                    dangerouslySetInnerHTML={{__html: qrCode}}
                />
                <p className="mt-2 text-lg">
                    Scan the QR code using xPortal
                </p>
                {
                    isMobile ? <a
                        href={uri}
                        className="mt-6 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        rel='noopener noreferrer nofollow'
                        target='_blank'
                    >
                        Login with xPortal
                    </a> : null
                }
                <button
                    className="mt-6 text-gray-600 hover:text-gray-900"
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    cancel
                </button>
            </div>
        </Popup>
    );

};
