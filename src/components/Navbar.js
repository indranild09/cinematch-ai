import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);

    alert("Logged Out");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left Side */}
      <div className="nav-left">
        <Link
          to="/home"
          className="nav-btn"
        >
          🏠 Home
        </Link>

        <Link
          to="/watchlist"
          className="nav-btn"
        >
          ❤️ Watchlist
        </Link>

        <Link
          to="/favorites"
          className="nav-btn"
        >
          ⭐ Favorites
        </Link>

        <Link
  to="/assistant"
  className="nav-btn"
>
  🤖 AI Assistant
</Link>
      </div>

      {/* Right Side */}
      <div className="nav-right">
        <button
          className="user-btn"
          onClick={() =>
            setShowMenu(!showMenu)
          }
        >
          👤 User ▼
        </button>

        {showMenu && (
          <div className="dropdown-menu">
            <button
  className="dropdown-item"
              onClick={() =>
                navigate("/profile")
              }
            >
              👤 Profile
            </button>

            <button
  className="dropdown-item"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}



export default Navbar;