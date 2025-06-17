
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';

import './Registrazione.css'

function Registration() {

  const navigate = useNavigate();
  const { setEmail } = useContext(UserContext);

  const {username, setUsername} = /*useState("")*/ useContext(UserContext);

  const [password, setPassword] = useState("");
  const [email_temp, setEmail_temp] = useState("");
  const [error, setError] = useState("");


  

  
  // Condizione per abilitare il bottone
  const isButtonDisabled = !username.trim() || !password.trim();
  
  const Registrati = () => {

    fetch('http://localhost:3001/register', {  // metti qui l'URL del tuo server backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_temp, username, password }),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.message); });
      }
      return res.json();
    })
    .then(data => {
      setError("");
      setEmail(decodeURIComponent(data.user.email));
      navigate("/Dashboard");
    })
    .catch(err => {
      setError(err.message);
    });
  };

  return (
    <div className="Register-page">
      <div className="Register-class">
          <header className="Register-header">
            <h1>Registrazione</h1>
          </header>
          <p>Registrati e programma la tua giornata!</p>
          {/* <div class="metodi-accesso">
            <img src="./logo512.png" alt="" />
            <img src="./logo512.png" alt="" />
            <img src="./logo512.png" alt="" />
          </div>
          <p class="secondo-p">Oppure:</p> */}
          <div className="accesso-alternativo">
            <input type="email" placeholder="Email" value={email_temp} onChange={(e) => setEmail_temp(e.target.value)}/>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <a className="link-password-dimenticata" href="a">Password dimenticata?</a>
            <input className="accedi-b" type="button" value="Registrati"  onClick={Registrati} disabled={isButtonDisabled}/>
          </div>
          {error && <p style={{color: 'red'}}>{error}</p>}
          <p>Hai già un account? <a className="link-registrazione" href="##" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Accedi qui!</a></p>
      </div>
    </div>
  );
}



export default Registration;