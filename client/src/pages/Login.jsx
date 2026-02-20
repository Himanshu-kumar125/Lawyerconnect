import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        alert("Login successful");
        window.location.href = "/";
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Login 🔐</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", display: "block", marginTop: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", display: "block", marginTop: "10px" }}
      />

      <button
        onClick={loginUser}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#0f172a",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
