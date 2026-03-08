import { useState } from "react";

const API = "http://127.0.0.1:8000";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("Logging in...");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(`❌ ${data.detail || "Admin login failed"}`);
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);
      localStorage.setItem("userType", "admin");

      window.location.href = "/admin";
    } catch {
      setMsg("❌ Server error");
    }
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Admin Username" style={inputStyle} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={inputStyle} />
          <button style={blueBtn}>Admin Login</button>
        </form>
        <p>{msg}</p>
      </div>
    </div>
  );
}

const wrap = {
  minHeight: "90vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
};

const card = {
  width: 420,
  background: "white",
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 14,
  borderRadius: 10,
  border: "1px solid #ccc",
};

const blueBtn = {
  width: "100%",
  padding: 12,
  border: "none",
  borderRadius: 10,
  background: "#1d4ed8",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};