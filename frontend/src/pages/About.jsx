import { useNavigate } from "react-router-dom";

export default function About(){

const navigate = useNavigate()

return (

<div style={{padding:"40px",fontFamily:"Arial",background:"#fafafa",minHeight:"100vh"}}>

<h1 style={{textAlign:"center",color:"#dc2626"}}>About LifeLink</h1>

<p style={{textAlign:"center",maxWidth:"800px",margin:"auto",fontSize:"18px",color:"#555"}}>
LifeLink is a smart blood donation and emergency management system designed
to connect donors, patients, hospitals, and blood banks in real time.  
The system helps people quickly find nearby blood donors and send emergency
requests during critical situations.
</p>

<div style={{marginTop:"40px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:"20px"}}>

<div style={card}>
<h3>🎯 Objective</h3>
<p>
The main objective of LifeLink is to reduce delays in blood donation during
medical emergencies by connecting nearby donors using a digital platform.
</p>
</div>

<div style={card}>
<h3>⚡ Key Features</h3>
<p>
• Donor search within radius  
• Emergency blood request  
• Admin approval system  
• Notifications  
• Blood camps and map view
</p>
</div>

<div style={card}>
<h3>🛠 Technologies</h3>
<p>
Frontend: React  
Backend: FastAPI  
Database: PostgreSQL  
Authentication: JWT  
Deployment Ready System
</p>
</div>

<div style={card}>
<h3>❤️ Social Impact</h3>
<p>
LifeLink helps save lives by reducing the time required to find blood donors
during emergencies and improving communication between donors and hospitals.
</p>
</div>

</div>

<div style={{textAlign:"center",marginTop:"40px"}}>

<button
onClick={()=>navigate("/")}
style={{
padding:"12px 20px",
background:"#2563eb",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer"
}}
>
Back to Home
</button>

</div>

</div>

)
}

const card = {
padding:"20px",
border:"1px solid #eee",
borderRadius:"12px",
background:"white",
boxShadow:"0 2px 8px rgba(0,0,0,0.05)"
}