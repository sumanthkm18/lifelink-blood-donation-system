export default function Camps() {
  const camps = [
    {
      name: "Whitefield Blood Camp",
      date: "Sunday, 10:00 AM",
      place: "Whitefield Community Hall",
      organizer: "LifeLink + NGO Partner",
      status: "Open",
    },
    {
      name: "Koramangala Donation Drive",
      date: "Saturday, 9:00 AM",
      place: "Koramangala Center",
      organizer: "City Blood Bank",
      status: "Open",
    },
    {
      name: "Indiranagar Health Camp",
      date: "Friday, 11:00 AM",
      place: "Indiranagar Metro Area",
      organizer: "Hospital Volunteers",
      status: "Limited Seats",
    },
  ];

  return (
    <div style={{ padding: 30, fontFamily: "Arial", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 8 }}>Blood Camps</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Explore upcoming blood donation camps, organizers, and participation details.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginTop: 20 }}>
        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>Upcoming Camps</h2>

          {camps.map((c, i) => (
            <div key={i} style={campCard}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ margin: "0 0 8px 0" }}>{c.name}</h3>
                  <p style={p}><b>Date:</b> {c.date}</p>
                  <p style={p}><b>Place:</b> {c.place}</p>
                  <p style={p}><b>Organizer:</b> {c.organizer}</p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={statusStyle(c.status)}>{c.status}</span>
                </div>
              </div>

              <button style={joinBtn}>View / Join Camp</button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={panel}>
            <h2 style={{ marginTop: 0 }}>Camp Summary</h2>

            <div style={statCard}>
              <div style={statLabel}>Total Camps</div>
              <div style={statValue}>{camps.length}</div>
            </div>

            <div style={statCard}>
              <div style={statLabel}>Open Camps</div>
              <div style={{ ...statValue, color: "#16a34a" }}>
                {camps.filter((c) => c.status === "Open").length}
              </div>
            </div>

            <div style={statCard}>
              <div style={statLabel}>Limited Seats</div>
              <div style={{ ...statValue, color: "#d97706" }}>
                {camps.filter((c) => c.status === "Limited Seats").length}
              </div>
            </div>
          </div>

          <div style={panel}>
            <h2 style={{ marginTop: 0 }}>Why Join?</h2>
            <p style={p}>❤️ Help patients during emergencies</p>
            <p style={p}>🏆 Earn donor recognition points</p>
            <p style={p}>🤝 Participate in community health drives</p>
            <p style={p}>📍 Find nearby organized donation camps</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Camp Highlights</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <div style={highlightCard}>
            <h3 style={{ marginTop: 0 }}>Safe Donation Process</h3>
            <p style={p}>Each camp follows basic screening, registration, and safe blood collection steps.</p>
          </div>

          <div style={highlightCard}>
            <h3 style={{ marginTop: 0 }}>Nearby Access</h3>
            <p style={p}>Users can discover camps close to their city and join easily.</p>
          </div>

          <div style={highlightCard}>
            <h3 style={{ marginTop: 0 }}>Awareness & Impact</h3>
            <p style={p}>Blood camps increase community participation and improve emergency preparedness.</p>
          </div>
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

const campCard = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 16,
  marginBottom: 14,
  background: "#fff",
};

const statCard = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  marginBottom: 12,
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

const highlightCard = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const joinBtn = {
  marginTop: 14,
  padding: "10px 14px",
  border: "none",
  borderRadius: 10,
  background: "#2563eb",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

function statusStyle(status) {
  if (status === "Open") {
    return {
      background: "#dcfce7",
      color: "#15803d",
      padding: "6px 12px",
      borderRadius: 20,
      fontWeight: "bold",
      fontSize: 13,
    };
  }

  return {
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 12px",
    borderRadius: 20,
    fontWeight: "bold",
    fontSize: 13,
  };
}

const p = {
  margin: "6px 0",
};