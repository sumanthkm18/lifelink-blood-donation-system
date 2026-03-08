export default function MapView() {
  const donors = [
    { name: "Rahul", blood: "O+", place: "Whitefield", distance: "4 km", available: "ON" },
    { name: "Priya", blood: "A+", place: "Koramangala", distance: "7 km", available: "ON" },
    { name: "Arjun", blood: "B+", place: "Indiranagar", distance: "9 km", available: "OFF" },
  ];

  const camps = [
    { name: "Whitefield Blood Camp", date: "Sunday 10 AM" },
    { name: "Koramangala Donation Drive", date: "Saturday 9 AM" },
  ];

  return (
    <div style={{ padding: 30, fontFamily: "Arial", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 8 }}>Nearby Donors Map</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        View donor locations, nearby camps, and availability status in one place.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginTop: 20 }}>
        <div style={panel}>
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=bangalore&z=12&output=embed"
            width="100%"
            height="450"
            style={{ border: "1px solid #ddd", borderRadius: 12, background: "white" }}
          ></iframe>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <div style={statCard}>
              <div style={statLabel}>Nearby Donors</div>
              <div style={statValue}>{donors.length}</div>
            </div>

            <div style={statCard}>
              <div style={statLabel}>Available Now</div>
              <div style={{ ...statValue, color: "#16a34a" }}>
                {donors.filter((d) => d.available === "ON").length}
              </div>
            </div>

            <div style={statCard}>
              <div style={statLabel}>Radius View</div>
              <div style={statValue}>10 km</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={panel}>
            <h2 style={{ marginTop: 0 }}>Map Legend</h2>
            <p style={p}>📍 Donor marker location</p>
            <p style={p}>🟢 Available donor</p>
            <p style={p}>🔴 Unavailable donor</p>
            <p style={p}>🏥 Nearby blood camp / hospital zone</p>
          </div>

          <div style={panel}>
            <h2 style={{ marginTop: 0 }}>Nearby Camps</h2>
            {camps.map((c, i) => (
              <div key={i} style={miniCard}>
                <b>{c.name}</b>
                <p style={{ margin: "6px 0 0 0", color: "#555" }}>{c.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Nearby Donor Points</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {donors.map((d, i) => (
            <div key={i} style={donorCard}>
              <h3 style={{ marginTop: 0 }}>{d.name}</h3>
              <p style={p}><b>Blood Group:</b> {d.blood}</p>
              <p style={p}><b>Location:</b> {d.place}</p>
              <p style={p}><b>Distance:</b> {d.distance}</p>
              <p style={p}>
                <b>Availability:</b>{" "}
                <span style={{ color: d.available === "ON" ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                  {d.available}
                </span>
              </p>

              <button
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: 10,
                  background: d.available === "ON" ? "#2563eb" : "#9ca3af",
                  color: "white",
                  fontWeight: "bold",
                  cursor: d.available === "ON" ? "pointer" : "not-allowed",
                }}
                disabled={d.available !== "ON"}
              >
                {d.available === "ON" ? "Contact / Request" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
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

const statCard = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  minWidth: 140,
};

const statLabel = {
  color: "#6b7280",
  fontSize: 14,
};

const statValue = {
  fontSize: 26,
  fontWeight: 800,
  marginTop: 6,
  color: "#111827",
};

const donorCard = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const miniCard = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  marginBottom: 10,
  background: "#fff",
};

const p = {
  margin: "6px 0",
};