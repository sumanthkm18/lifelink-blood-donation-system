import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (
    <div style={{fontFamily:"Arial", textAlign:"center", padding:"40px", background:"#fafafa", minHeight:"100vh"}}>

      <h1 style={{fontSize:"42px", color:"#dc2626"}}>
        LifeLink
      </h1>

      <p style={{fontSize:"18px", color:"#555"}}>
        Smart Blood Donation & Emergency Management System
      </p>

      <div style={{marginTop:"30px"}}>

        <button
          onClick={() => navigate("/login")}
          style={btnBlue}
        >
          User Login
        </button>

        <button
          onClick={() => navigate("/register")}
          style={btnGreen}
        >
          Register
        </button>

        <button
          onClick={() => navigate("/admin-login")}
          style={btnRed}
        >
          Admin Login
        </button>

        <button
          onClick={() => navigate("/about")}
          style={btnPurple}
        >
          About LifeLink
        </button>

      </div>


      {/* HOW LIFELINK WORKS SECTION */}

      <div style={{marginTop:"60px"}}>

        <h2>How LifeLink Works</h2>

        <div style={grid}>

          <div style={card}>
            <h3>1️⃣ Register</h3>
            <p>
              Create your account as a blood donor or patient to access the LifeLink platform.
            </p>
          </div>

          <div style={card}>
            <h3>2️⃣ Search Donors</h3>
            <p>
              Find nearby blood donors using city search and radius filtering (5–10 km).
            </p>
          </div>

          <div style={card}>
            <h3>3️⃣ Send Request</h3>
            <p>
              Send emergency blood requests instantly to available donors.
            </p>
          </div>

          <div style={card}>
            <h3>4️⃣ Save Lives</h3>
            <p>
              Admin reviews requests and connects donors with patients quickly.
            </p>
          </div>

        </div>

      </div>


      {/* FEATURES SECTION */}

      <div style={{marginTop:"60px"}}>

        <h2>Key Features</h2>

        <div style={grid}>

          <div style={card}>
            <h3>🔎 Smart Donor Search</h3>
            <p>Find blood donors within selected radius quickly.</p>
          </div>

          <div style={card}>
            <h3>🚨 Emergency Requests</h3>
            <p>Send urgent blood requests during critical situations.</p>
          </div>

          <div style={card}>
            <h3>📍 Map View</h3>
            <p>View blood camps and donation locations on map.</p>
          </div>

          <div style={card}>
            <h3>🏆 Leaderboard</h3>
            <p>Gamified system showing top donors and contributions.</p>
          </div>

        </div>

      </div>

    </div>
  )
}

const btnBlue = {
  padding:"12px 20px",
  margin:"10px",
  background:"#2563eb",
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
}

const btnGreen = {
  padding:"12px 20px",
  margin:"10px",
  background:"#16a34a",
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
}

const btnRed = {
  padding:"12px 20px",
  margin:"10px",
  background:"#dc2626",
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
}

const btnPurple = {
  padding:"12px 20px",
  margin:"10px",
  background:"#7c3aed",
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
}

const grid = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
  gap:"20px",
  marginTop:"20px"
}

const card = {
  padding:"20px",
  border:"1px solid #eee",
  borderRadius:"10px",
  background:"white",
  boxShadow:"0 2px 8px rgba(0,0,0,0.05)"
}