import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);

    alert("Logged Out");

    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        background: "#111",
        borderBottom: "1px solid #333",
      }}
    >
      {/* Left Side */}
      <div
        style={{
          display: "flex",
gap: "8px",
flexWrap: "wrap",
        }}
      >
        <Link
          to="/home"
          style={navButton}
        >
          🏠 Home
        </Link>

        <Link
          to="/watchlist"
          style={navButton}
        >
          ❤️ Watchlist
        </Link>

        <Link
          to="/favorites"
          style={navButton}
        >
          ⭐ Favorites
        </Link>
      </div>

      {/* Right Side */}
      <div
        style={{
          position: "relative",
        }}
      >
        <button
          style={userButton}
          onClick={() =>
            setShowMenu(!showMenu)
          }
        >
          👤 User ▼
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "45px",
              background: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: "10px",
              minWidth: "160px",
              overflow: "hidden",
              zIndex: 999,
            }}
          >
            <button
              style={menuItem}
              onClick={() =>
                navigate("/profile")
              }
            >
              👤 Profile
            </button>

            <button
              style={menuItem}
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

const navButton = {
  textDecoration: "none",
  color: "white",
  background: "#222",
  padding: "8px 12px",
  borderRadius: "8px",
  fontWeight: "600",
};

const userButton = {
  background: "#222",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const menuItem = {
  width: "100%",
  background: "transparent",
  color: "white",
  border: "none",
  padding: "12px",
  textAlign: "left",
  cursor: "pointer",
};

export default Navbar;