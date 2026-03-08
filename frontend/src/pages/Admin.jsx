import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Admin() {
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState("");

  const loadRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        setMsg("Failed to load requests");
        return;
      }

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setMsg("Server error");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/requests/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setMsg("Approve failed");
        return;
      }

      setMsg("✅ Request approved");
      loadRequests();
    } catch (err) {
      console.log(err);
      setMsg("Server error");
    }
  };

  const rejectRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/requests/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setMsg("Reject failed");
        return;
      }

      setMsg("❌ Request rejected");
      loadRequests();
    } catch (err) {
      console.log(err);
      setMsg("Server error");
    }
  };

  const totalCount = requests.length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const recentActivity = requests.slice(0, 5);

  const percent = (count) => {
    if (totalCount === 0) return 0;
    return Math.round((count / totalCount) * 100);
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 8 }}>Admin Dashboard</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Manage emergency blood requests and monitor analytics.
      </p>

      {msg && (
        <div
          style={{
            marginBottom: 20,
            padding: 12,
            borderRadius: 10,
            background: "#fff",
            border: "1px solid #ddd",
            fontWeight: 600,
          }}
        >
          {msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard title="Total Requests" value={totalCount} color="#111827" />
        <StatCard title="Approved" value={approvedCount} color="#16a34a" />
        <StatCard title="Pending" value={pendingCount} color="#d97706" />
        <StatCard title="Rejected" value={rejectedCount} color="#dc2626" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>Request Analytics</h2>

          <BarRow label="Approved" value={approvedCount} percentage={percent(approvedCount)} color="#16a34a" />
          <BarRow label="Pending" value={pendingCount} percentage={percent(pendingCount)} color="#d97706" />
          <BarRow label="Rejected" value={rejectedCount} percentage={percent(rejectedCount)} color="#dc2626" />
        </div>

        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>Recent Activity</h2>

          {recentActivity.length === 0 && <p>No recent activity.</p>}

          {recentActivity.map((r) => (
            <div key={r.id} style={activityCard}>
              <p style={{ margin: 0, fontWeight: 700 }}>{r.patient_name}</p>
              <p style={{ margin: "6px 0", color: "#555" }}>
                {r.blood_group} request in {r.city}
              </p>
              <small style={statusStyle(r.status)}>{r.status}</small>
            </div>
          ))}
        </div>
      </div>

      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>All Requests</h2>

        {requests.length === 0 && <p>No requests available.</p>}

        {requests.map((r) => (
          <div key={r.id} style={requestCard}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: "0 0 8px 0" }}>{r.patient_name}</h3>
                <p style={p}><b>Blood Group:</b> {r.blood_group}</p>
                <p style={p}><b>Hospital:</b> {r.hospital_name}</p>
                <p style={p}><b>City:</b> {r.city}</p>
                <p style={p}><b>Status:</b> <span style={statusStyle(r.status)}>{r.status}</span></p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  onClick={() => approveRequest(r.id)}
                  style={{ ...actionBtn, background: "#16a34a" }}
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectRequest(r.id)}
                  style={{ ...actionBtn, background: "#dc2626" }}
                >
                  Reject
                </button>
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

function BarRow({ label, value, percentage, color }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span>{value} ({percentage}%)</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 14,
          background: "#e5e7eb",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: color,
          }}
        />
      </div>
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
};

const activityCard = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
  background: "#fff",
};

const actionBtn = {
  border: "none",
  borderRadius: 10,
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
  padding: "10px 14px",
  minWidth: 100,
};

const p = {
  margin: "6px 0",
};

function statusStyle(status) {
  if (status === "approved") {
    return { color: "#16a34a", fontWeight: 700 };
  }
  if (status === "rejected") {
    return { color: "#dc2626", fontWeight: 700 };
  }
  return { color: "#d97706", fontWeight: 700 };
}