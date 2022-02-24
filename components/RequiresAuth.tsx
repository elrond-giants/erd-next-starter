import {useAuth} from "../auth/useAccount";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {authPath} from "../utils/routes";

export default function RequiresAuth({children}: { children: any }) {
    const {loggedIn} = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (loggedIn) {
            return;
        }

        (async () => {
            await router.replace(authPath);
        })();
    }, [loggedIn, router]);

    if (loggedIn) {
        return <>{children}</>
    }
    return <div>Loading</div>
};
