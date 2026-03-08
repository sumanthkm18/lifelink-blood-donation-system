import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      let localAlerts = [];

      try {
        localAlerts = JSON.parse(localStorage.getItem("alerts") || "[]");
      } catch {
        localAlerts = [];
      }

      let requestNotifications = [];

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => []);

        if (Array.isArray(data)) {
          requestNotifications = data.map((r) => ({
            id: `req-${r.id}`,
            message: `Request for ${r.patient_name} (${r.blood_group}) is ${r.status}`,
            time: "Backend status update",
          }));
        }
      } catch (err) {
        console.log(err);
      }

      setItems([...localAlerts, ...requestNotifications]);
    };

    loadNotifications();
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Notifications 🔔</h1>

      {items.length === 0 && <p>No notifications yet.</p>}

      {items.map((item, i) => (
        <div key={item.id || i} style={card}>
          <p style={{ margin: 0, fontWeight: 600 }}>{item.message}</p>
          <small style={{ color: "#666" }}>{item.time}</small>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: 14,
  borderRadius: 12,
  marginBottom: 10,
  background: "white",
};