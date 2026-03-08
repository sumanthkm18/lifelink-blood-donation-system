import { useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Emergency() {
  const [patient, setPatient] = useState("");
  const [blood, setBlood] = useState("");
  const [hospital, setHospital] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [units, setUnits] = useState("");
  const [msg, setMsg] = useState("");

  const createRequest = async (e) => {
    e.preventDefault();

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
          patient_name: patient,
          blood_group: blood,
          units_required: Number(units),
          hospital_name: hospital,
          city: city,
          area: area,
          contact_phone: phone,
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
        } else if (data?.detail) {
          errorText = JSON.stringify(data.detail);
        }

        setMsg(`❌ ${errorText}`);
        return;
      }

      const existing = JSON.parse(localStorage.getItem("alerts") || "[]");

      const newAlert = {
        id: Date.now(),
        message: `🚨 Emergency alert: ${patient} needs ${blood} blood at ${hospital}, ${city}`,
        time: new Date().toLocaleString(),
      };

      localStorage.setItem("alerts", JSON.stringify([newAlert, ...existing]));

      setMsg("🚨 Emergency request created successfully and alert sent");

      setPatient("");
      setBlood("");
      setHospital("");
      setCity("");
      setArea("");
      setPhone("");
      setUnits("");
    } catch (err) {
      console.log(err);
      setMsg("❌ Server error");
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Emergency Blood Request</h1>

      <form onSubmit={createRequest} style={{ maxWidth: 500 }}>
        <input
          placeholder="Patient Name"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Blood Group"
          value={blood}
          onChange={(e) => setBlood(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Units Required"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Hospital Name"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Contact Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <button style={btn}>Create Emergency Request</button>
      </form>

      {msg && <p style={{ marginTop: 15, fontWeight: "bold" }}>{msg}</p>}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #ccc",
};

const btn = {
  padding: "12px 16px",
  border: "none",
  borderRadius: 10,
  background: "#dc2626",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};