import { useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Search() {
  const [city, setCity] = useState("");
  const [blood, setBlood] = useState("");
  const [radius, setRadius] = useState("10");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [donors, setDonors] = useState([]);
  const [msg, setMsg] = useState("");

  const searchDonors = async () => {
    try {
      setMsg("");

      const res = await fetch(
        `${API}/search?city=${encodeURIComponent(city)}&blood_group=${encodeURIComponent(blood)}`
      );

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        setMsg("Search failed");
        return;
      }

      // Add smart demo values for distance and availability
      const enriched = (Array.isArray(data) ? data : []).map((d, i) => ({
        ...d,
        distance_km: [3, 6, 9, 12, 15][i % 5],
        available: i % 4 !== 3, // mostly available
      }));

      let filtered = enriched.filter((d) => d.distance_km <= Number(radius));

      if (availableOnly) {
        filtered = filtered.filter((d) => d.available === true);
      }

      setDonors(filtered);

      if (filtered.length === 0) {
        setMsg("No donors found for selected radius / availability.");
      }
    } catch (err) {
      console.log(err);
      setMsg("Backend error");
    }
  };

  const requestDonor = async (donor) => {
    try {
      setMsg("");
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_name: "Requested from Search",
          blood_group: donor.blood_group,
          units_required: 1,
          hospital_name: "LifeLink Demo Hospital",
          city: donor.city,
          area: donor.city,
          contact_phone: "9876543210",
          is_emergency: true,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        let errorText = "Request failed";

        if (typeof data?.detail === "string") {
          errorText = data.detail;
        } else if (Array.isArray(data?.detail)) {
          errorText = data.detail
            .map((item) => `${item.loc?.join(" → ")}: ${item.msg}`)
            .join(" | ");
        }

        setMsg(`❌ ${errorText}`);
        return;
      }

      setMsg(`✅ Request created successfully for ${donor.name}`);
    } catch (err) {
      console.log(err);
      setMsg("❌ Server error");
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial", background: "#fafafa", minHeight: "100vh" }}>
      <h1>Search Donors</h1>

      <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <input
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Blood Group"
          value={blood}
          onChange={(e) => setBlood(e.target.value)}
          style={inputStyle}
        />

        <select value={radius} onChange={(e) => setRadius(e.target.value)} style={inputStyle}>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="20">Within 20 km</option>
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: 8, background: "white", padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc" }}>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available Only
        </label>

        <button style={btn} onClick={searchDonors}>
          Search
        </button>
      </div>

      {msg && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 10,
            fontWeight: 600,
          }}
        >
          {msg}
        </div>
      )}

      {donors.map((d, i) => (
        <div key={i} style={card}>
          <h3>{d.name}</h3>
          <p>Blood Group: {d.blood_group}</p>
          <p>City: {d.city}</p>
          <p>Distance: {d.distance_km} km</p>
          <p>
            Availability:{" "}
            <span style={{ color: d.available ? "green" : "red", fontWeight: "bold" }}>
              {d.available ? "ON" : "OFF"}
            </span>
          </p>

          <button
            style={{
              ...requestBtn,
              opacity: d.available ? 1 : 0.6,
              cursor: d.available ? "pointer" : "not-allowed",
            }}
            onClick={() => d.available && requestDonor(d)}
            disabled={!d.available}
          >
            {d.available ? "Request Donor" : "Unavailable"}
          </button>
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ccc",
};

const card = {
  border: "1px solid #ddd",
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
  background: "white",
};

const btn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};

const requestBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 8,
  background: "#dc2626",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
};