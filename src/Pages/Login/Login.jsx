
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';

import './Login.css'

function Login() {

  const navigate = useNavigate();
  const { setEmail } = useContext(UserContext);
  const {username, setUsername} = /*useState("")*/ useContext(UserContext);
  const [password, setPassword] = useState("");
  const [email_temp, setEmail_temp] = useState("");
  const [error, setError] = useState("");

  //CONDIZIONE ABILITARE CONFERMA
  const isButtonDisabled = !username.trim() || !password.trim();
  
  //LOGIN
  const Loggati = () => {
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_temp, username, password }),
    })
    .then(res => {
      if (!res.ok) throw new Error('Credenziali non valide');
      return res.json();
    })
    .then(data => {
      const user = { email: data.user.email, username: data.user.username };
      localStorage.setItem('user', JSON.stringify(user));
      setError("");
      setEmail(decodeURIComponent(data.user.email));
      navigate("/Dashboard");
    })
    .catch(err => {
      setError(err.message);
    });
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
            <input type="email" placeholder="Email" value={email_temp} onChange={(e) => setEmail_temp(e.target.value)}/>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <a className="link-password-dimenticata" href="a">Password dimenticata?</a>
            <input className="accedi-b" type="button" value="Accedi"  onClick={Loggati} disabled={isButtonDisabled}/>
          </div>
          {error && <p style={{color: 'red'}}>{error}</p>}
          <p>Non hai ancora un account? <a className="link-registrazione" href="##" onClick={(e) => { e.preventDefault(); navigate('/Registration'); }}>Registrati qui!</a></p>
      </div>
    </div>
  );
}
export default Login;