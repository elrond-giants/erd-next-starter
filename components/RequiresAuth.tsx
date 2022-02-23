import {useAuth} from "../auth/useAccount";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {authPath} from "../utils/routes";

export default function RequiresAuth({children}) {
    const {loggedIn} = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loggedIn) {
            router.push(authPath)
        }
    }, [loggedIn]);

    if (loggedIn) {
        return <>{children}</>
    }
    return <div>Loading</div>
};
