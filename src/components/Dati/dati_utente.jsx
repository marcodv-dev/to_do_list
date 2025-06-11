
import './dati_utente.css'
import { useNavigate } from 'react-router-dom';

function Dati_utente ({ username, setUsername /*, email */ }) {

    const navigate = useNavigate();


    const logout = () =>{
        navigate("/");
    }

    return (
        <div className="dati">
            <label htmlFor="">email {/*email*/} </label>
            <input className="username" type="text" name="" id="" value={username} onChange={e => setUsername(e.target.value)}/>
            <input className="logout" onClick={logout} type="button" value="Logout"/>
        </div>
    );
}

export default Dati_utente;