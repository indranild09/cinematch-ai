import { useState } from "react";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "../firebase";

import {
  doc,
  setDoc,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import "../App.css";

function Signup() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await setDoc(
        doc(
          db,
          "users",
          userCredential.user.uid
        ),
        {
          uid: userCredential.user.uid,
          email:
            userCredential.user.email,
          createdAt:
            new Date().toISOString(),
          watchlist: [],
          favorites: [],
        }
      );

      alert(
        "Account Created Successfully 🎉"
      );

      navigate("/login");
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
          Join CineMatch AI
        </div>

        <div className="auth-subtitle">
          Create your movie account
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
          onClick={handleSignup}
        >
          Create Account
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <span
            className="auth-link"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;