import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const userType = localStorage.getItem("userType") || "user";

  const savedAvailability = localStorage.getItem("availability") || "ON";
  const [availability, setAvailability] = useState(savedAvailability);

  const toggleAvailability = () => {
    const newValue = availability === "ON" ? "OFF" : "ON";
    setAvailability(newValue);
    localStorage.setItem("availability", newValue);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial", background: "#fafafa", minHeight: "100vh" }}>
      <h1>My Profile</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        <div style={bigCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={avatar}>{username.charAt(0).toUpperCase()}</div>
            <div>
              <h2 style={{ margin: 0 }}>{username}</h2>
              <p style={{ margin: "6px 0", color: "#666" }}>{userType}</p>
              <span style={badge}>Active ✅</span>
            </div>
          </div>

          <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #eee" }} />

          <p><b>City:</b> Bangalore</p>
          <p><b>Joined:</b> 2026</p>
          <p><b>Authentication:</b> Token Verified 🔐</p>

          <div style={{ marginTop: 20, padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
            <h3 style={{ marginTop: 0 }}>Donor Availability</h3>
            <p style={{ marginBottom: 12 }}>
              Current Status:{" "}
              <span style={{ color: availability === "ON" ? "green" : "red", fontWeight: "bold" }}>
                {availability}
              </span>
            </p>

            <button
              onClick={toggleAvailability}
              style={{
                padding: "10px 14px",
                border: "none",
                borderRadius: 10,
                background: availability === "ON" ? "#dc2626" : "#16a34a",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Turn {availability === "ON" ? "OFF" : "ON"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={bigCard}>
            <h3 style={{ marginTop: 0 }}>Quick Stats</h3>
            <div style={miniStat}>Requests Created: 5</div>
            <div style={miniStat}>Approved: 2</div>
            <div style={miniStat}>Pending: 2</div>
          </div>

          <div style={bigCard}>
            <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
            <button onClick={() => navigate("/search")} style={actionBtn("#2563eb")}>Search Donors</button>
            <button onClick={() => navigate("/emergency")} style={actionBtn("#dc2626")}>Emergency Request</button>
            <button onClick={() => navigate("/leaderboard")} style={actionBtn("#7c3aed")}>Leaderboard</button>
            {userType === "admin" && (
              <button onClick={() => navigate("/admin")} style={actionBtn("#059669")}>Open Admin</button>
            )}
            <button onClick={logout} style={actionBtn("#111827")}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const bigCard = {
  background: "white",
  borderRadius: 18,
  padding: 24,
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  border: "1px solid #eee",
};

const avatar = {
  width: 90,
  height: 90,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #dc2626, #2563eb)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: 36,
  fontWeight: "bold",
};

const badge = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: 20,
  background: "#dcfce7",
  color: "#15803d",
  fontWeight: "bold",
  fontSize: 13,
};

const miniStat = {
  padding: 14,
  borderRadius: 12,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  marginBottom: 10,
};

const actionBtn = (bg) => ({
  width: "100%",
  padding: "12px 16px",
  border: "none",
  borderRadius: 12,
  background: bg,
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 14,
  marginBottom: 10,
});