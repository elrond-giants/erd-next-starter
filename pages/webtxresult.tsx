import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function Webtxresult() {
    const router = useRouter();
    const [txStatus, setTxStatus] = useState<string>('');
    const [txHash, setTxHash] = useState<string>('');


    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        const {status, txHash: hash} = router.query;
        setTxStatus(status as string);
        setTxHash(hash as string);

    }, [router]);

    return (
        <div>
            <span>Hash: {txHash}</span>
            <span>Status: {txStatus}</span>
        </div>
    );
};