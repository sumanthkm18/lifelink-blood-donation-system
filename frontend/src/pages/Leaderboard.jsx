export default function Leaderboard() {
  const donors = [
    { name: "Rahul", blood: "O+", city: "Whitefield", donations: 12, points: 120, badge: "Gold" },
    { name: "Priya", blood: "A+", city: "Koramangala", donations: 10, points: 100, badge: "Silver" },
    { name: "Arjun", blood: "B+", city: "Indiranagar", donations: 8, points: 80, badge: "Bronze" },
    { name: "Sumanth", blood: "AB+", city: "Marathahalli", donations: 6, points: 60, badge: "Rising Donor" },
  ];

  return (
    <div style={{ padding: 30, fontFamily: "Arial", background: "#fafafa", minHeight: "100vh" }}>
      <h1>Donor Leaderboard 🏆</h1>
      <p>Top active donors in the LifeLink platform.</p>

      <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
        {donors.map((d, i) => (
          <div key={i} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ margin: "0 0 6px 0" }}>
                  #{i + 1} {d.name}
                </h2>
                <p style={{ margin: "4px 0" }}>Blood Group: <b>{d.blood}</b></p>
                <p style={{ margin: "4px 0" }}>City: {d.city}</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={pointsBox}>{d.points} pts</div>
                <div style={{ marginTop: 8 }}>
                  <span style={badgeStyle(d.badge)}>{d.badge}</span>
                </div>
              </div>
            </div>

            <hr style={{ margin: "14px 0", border: "none", borderTop: "1px solid #eee" }} />

            <p style={{ margin: 0 }}>
              Total Donations: <b>{d.donations}</b>
            </p>
          </div>
        ))}
      </div>

      <div style={rulesCard}>
        <h3 style={{ marginTop: 0 }}>Points System</h3>
        <p style={{ margin: "6px 0" }}>• Every donation = 10 points</p>
        <p style={{ margin: "6px 0" }}>• 100+ points = Gold Donor</p>
        <p style={{ margin: "6px 0" }}>• 80+ points = Silver Donor</p>
        <p style={{ margin: "6px 0" }}>• 60+ points = Bronze / Rising Donor</p>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 18,
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const pointsBox = {
  background: "#111827",
  color: "white",
  padding: "10px 14px",
  borderRadius: 12,
  fontWeight: "bold",
  minWidth: 90,
  textAlign: "center",
};

const rulesCard = {
  marginTop: 24,
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 18,
};

function badgeStyle(badge) {
  let bg = "#e5e7eb";
  let color = "#111827";

  if (badge === "Gold") {
    bg = "#fef3c7";
    color = "#92400e";
  } else if (badge === "Silver") {
    bg = "#e5e7eb";
    color = "#374151";
  } else if (badge === "Bronze") {
    bg = "#fde68a";
    color = "#78350f";
  } else if (badge === "Rising Donor") {
    bg = "#dbeafe";
    color = "#1d4ed8";
  }

  return {
    background: bg,
    color,
    padding: "6px 12px",
    borderRadius: 20,
    fontWeight: "bold",
    fontSize: 13,
  };
}