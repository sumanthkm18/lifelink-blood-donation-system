import { useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    try{

      const res = await fetch(`${API}/auth/register`,{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          name:name,
          email:email,
          password:password
        })

      });

      const data = await res.json().catch(()=>({}));

      if(!res.ok){

        let errorText = "Registration failed";

        if(data?.detail){
          errorText = typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);
        }

        setMsg(`❌ ${errorText}`);
        return;
      }

      setMsg("✅ Registration successful");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(()=>{
        window.location.href="/welcome";
      },1000);

    }
    catch(err){

      console.log(err);
      setMsg("❌ Server error");

    }

  };

  return(

    <div style={{padding:30,fontFamily:"Arial"}}>

      <h1>Create Account</h1>

      <form onSubmit={handleRegister} style={{maxWidth:400}}>

        <input
        placeholder="Full Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        style={inputStyle}
        required
        />

        <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        style={inputStyle}
        required
        />

        <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        style={inputStyle}
        required
        />

        <button style={btn}>
          Register
        </button>

      </form>

      {msg && <p style={{marginTop:15}}>{msg}</p>}

    </div>

  );

}

const inputStyle={
  width:"100%",
  padding:12,
  marginBottom:12,
  borderRadius:10,
  border:"1px solid #ccc"
};

const btn={
  padding:"12px 16px",
  border:"none",
  borderRadius:10,
  background:"#2563eb",
  color:"white",
  fontWeight:"bold",
  cursor:"pointer"
};