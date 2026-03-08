import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => []);

      if (Array.isArray(data)) {
        setRequests(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  return (
    <div style={{ padding: 30, fontFamily: "Arial", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 8 }}>User Dashboard</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Track your requests, explore donor features, and manage your activity.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 20 }}>
        <StatCard title="Total Requests" value={requests.length} color="#111827" />
        <StatCard title="Approved" value={approvedCount} color="#16a34a" />
        <StatCard title="Pending" value={pendingCount} color="#d97706" />
        <StatCard title="Rejected" value={rejectedCount} color="#dc2626" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginTop: 24 }}>
        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>Quick Actions</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <button onClick={() => navigate("/search")} style={actionBtn("#2563eb")}>
              Search Donors
            </button>

            <button onClick={() => navigate("/emergency")} style={actionBtn("#dc2626")}>
              Emergency Request
            </button>

            <button onClick={() => navigate("/map")} style={actionBtn("#7c3aed")}>
              Map View
            </button>

            <button onClick={() => navigate("/camps")} style={actionBtn("#059669")}>
              Blood Camps
            </button>

            <button onClick={() => navigate("/leaderboard")} style={actionBtn("#ea580c")}>
              Leaderboard
            </button>

            <button onClick={() => navigate("/notifications")} style={actionBtn("#111827")}>
              Notifications
            </button>
          </div>
        </div>

        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>Account Summary</h2>
          <p style={p}><b>Status:</b> Active ✅</p>
          <p style={p}><b>Authentication:</b> Verified 🔐</p>
          <p style={p}><b>Availability Feature:</b> Enabled</p>
          <p style={p}><b>Radius Search:</b> 5 / 10 / 20 km supported</p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>My Blood Requests</h2>

        {requests.length === 0 && (
          <div style={panel}>
            <p style={{ margin: 0 }}>No requests created yet.</p>
          </div>
        )}

        {requests.map((r) => (
          <div key={r.id} style={requestCard}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: "0 0 8px 0" }}>{r.patient_name}</h3>
                <p style={p}><b>Blood Group:</b> {r.blood_group}</p>
                <p style={p}><b>Hospital:</b> {r.hospital_name}</p>
                <p style={p}><b>City:</b> {r.city}</p>
              </div>

              <div>
                <span style={statusBadge(r.status)}>{r.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ color: "#6b7280", fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color, marginTop: 8 }}>{value}</div>
    </div>
  );
}

const panel = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 20,
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const requestCard = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 16,
  marginBottom: 14,
  background: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
};

const p = {
  margin: "6px 0",
};

const actionBtn = (bg) => ({
  width: "100%",
  padding: "12px 14px",
  border: "none",
  borderRadius: 12,
  background: bg,
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
});

function statusBadge(status) {
  if (status === "approved") {
    return {
      background: "#dcfce7",
      color: "#15803d",
      padding: "8px 14px",
      borderRadius: 20,
      fontWeight: "bold",
      fontSize: 13,
    };
  }

  if (status === "rejected") {
    return {
      background: "#fee2e2",
      color: "#b91c1c",
      padding: "8px 14px",
      borderRadius: 20,
      fontWeight: "bold",
      fontSize: 13,
    };
  }

  return {
    background: "#fef3c7",
    color: "#92400e",
    padding: "8px 14px",
    borderRadius: 20,
    fontWeight: "bold",
    fontSize: 13,
  };
}