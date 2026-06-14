import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        doc(db, "users", userCredential.user.uid),
        {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          createdAt: new Date().toISOString(),
          watchlist: [],
          favorites: []
        }
      );

      

      alert("Account Created Successfully 🎉");

      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        color: "white",
        minHeight: "100vh",
        background: "#0d0d0d"
      }}
    >
      <h1>Signup</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          width: "300px"
        }}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px",
          width: "300px"
        }}
      />

      <br />
      <br />

      <button
        onClick={handleSignup}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Signup
      </button>
    </div>
  );
}

export default Signup;