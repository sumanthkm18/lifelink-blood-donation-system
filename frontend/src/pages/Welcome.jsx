import { useNavigate } from "react-router-dom";

export default function Welcome() {

  const navigate = useNavigate();

  return (

    <div style={{padding:40,fontFamily:"Arial",textAlign:"center"}}>

      <h1>Welcome to LifeLink ❤️</h1>

      <p style={{fontSize:18}}>
        Your account has been created successfully.
      </p>

      <p>
        LifeLink helps connect blood donors and patients quickly during emergencies.
      </p>

      <div style={{marginTop:30}}>

        <button
        onClick={()=>navigate("/dashboard")}
        style={btn}
        >
          Go to Dashboard
        </button>

      </div>

    </div>

  );
}

const btn={
  padding:"12px 18px",
  border:"none",
  borderRadius:10,
  background:"#dc2626",
  color:"white",
  fontWeight:"bold",
  cursor:"pointer"
};