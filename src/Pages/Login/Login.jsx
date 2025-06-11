
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import './Login.css'

function Login() {

  const navigate = useNavigate();

  const { username, setUsername } = useContext(UserContext);
  const [password, setPassword] = useState("");


  

  
  // Condizione per abilitare il bottone
  const isButtonDisabled = !username.trim() || !password.trim();

  const Loggati = () => {
    navigate("/Dashboard");
  };

  return (
    <div className="login-page">
      <div className="Login-class">
          <header className="Login-header">
            <h1>Login</h1>
          </header>
          <p>Accedi e porta a termine la tua giornata!</p>
          {/* <div class="metodi-accesso">
            <img src="./logo512.png" alt="" />
            <img src="./logo512.png" alt="" />
            <img src="./logo512.png" alt="" />
          </div>
          <p class="secondo-p">Oppure:</p> */}
          <div className="accesso-alternativo">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <a className="link-password-dimenticata" href="a">Password dimenticata?</a>
            <input className="accedi-b" type="button" value="Accedi"  onClick={Loggati} disabled={isButtonDisabled}/>
          </div>
          <p>Non hai ancora un account? <a className="link-registrazione" href="a">Registrati qui!</a></p>
      </div>
    </div>
  );
}



export default Login;