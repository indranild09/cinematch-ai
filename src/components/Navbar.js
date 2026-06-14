import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);

        alert("Logged Out");

        navigate("/login");
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                background: "#111",
            }}
        >
            <Link to="/">Home</Link>

            <Link to="/profile">
                Profile
            </Link>

            <Link to="/watchlist">
                Watchlist
            </Link>

            <Link to="/favorites">
                Favorites
            </Link>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Navbar;