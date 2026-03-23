import { Link } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

function Layout({ children }: Props) {
    return (
        <div>
            <header>
                <nav>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/login">Login</Link> |{" "}
                    <Link to="/profile">Profile</Link> |{" "}
                    <Link to="/trip">Trip</Link>
                </nav>
            </header>

            <main>
                {children}
            </main>
        </div>
    );
}

export default Layout;