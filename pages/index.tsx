import type {NextPage} from 'next'
import RequiresAuth from "../components/RequiresAuth";


const Home: NextPage = () => {

    return (
        <RequiresAuth>
            <div>Hello, Elrond Next Starter Kit!</div>
        </RequiresAuth>
    );
}

export default Home
