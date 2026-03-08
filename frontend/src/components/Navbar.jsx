import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (

    <div style={navStyle}>

      <div style={logoStyle}>
        LifeLink
      </div>

      <div style={menuStyle}>

        <Link style={linkStyle} to="/">Home</Link>

        <Link style={linkStyle} to="/search">Search</Link>

        <Link style={linkStyle} to="/emergency">Emergency</Link>

        <Link style={linkStyle} to="/map">Map</Link>

        <Link style={linkStyle} to="/camps">Camps</Link>

        <Link style={linkStyle} to="/leaderboard">Leaderboard</Link>

        <Link style={linkStyle} to="/notifications">Notifications</Link>

        <Link style={linkStyle} to="/profile">Profile</Link>

        <Link style={linkStyle} to="/about">About</Link>

        {token && (
          <button style={logoutBtn} onClick={logout}>
            Logout
          </button>
        )}

      </div>

    </div>

  );

}

const navStyle = {

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 40px",
  background: "#dc2626",
  color: "white",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"

};

const logoStyle = {

  fontSize: "22px",
  fontWeight: "bold"

};

const menuStyle = {

  display: "flex",
  alignItems: "center",
  gap: "20px"

};

const linkStyle = {

  color: "white",
  textDecoration: "none",
  fontWeight: "bold"

};

const logoutBtn = {

  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  background: "white",
  color: "#dc2626",
  fontWeight: "bold",
  cursor: "pointer"

};