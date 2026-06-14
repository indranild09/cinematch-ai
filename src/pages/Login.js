import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          🎬
        </div>

        <div className="auth-title">
          CineMatch AI
        </div>

        <div className="auth-subtitle">
          Discover movies you'll love
        </div>

        <input
          className="auth-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="auth-btn"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="auth-footer">
          Not a user?{" "}
          <span
            className="auth-link"
            onClick={() =>
              navigate("/signup")
            }
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;