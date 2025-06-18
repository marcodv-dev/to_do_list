
import './Profile.css'
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext.jsx';
import { useEffect } from 'react';
import Navbar from '../../components/NavBar_Profile/navbar.jsx';
import Foto from '../../components/Foto_profile/immagine_profilo.jsx';
import Dati from '../../components/Dati/dati_utente.jsx';

function Profile() {

    const { username, setUsername } = useContext(UserContext);
    const { fotoURL, setFotoURL } = useContext(UserContext);
    const { email } = useContext(UserContext);
    const location = useLocation();

    //CALCOLO ATTIVITÀ
    const completate = location.state?.completateCount || 0;
    const totali = location.state?.att_num || 0;
    const mancanti = totali - completate;
    
    //CARICA INFORMAZIONI UTENTE
    useEffect(() => {
        if (email) {
            fetch(`http://localhost:3001/utente/${encodeURIComponent(email)}`)
                .then(res => res.json())
                .then(data => {
                    setUsername(data.username);
                    if(data.foto!=='') setFotoURL(data.foto);
                })
                .catch(err => console.error(err));
        }
    }, [email]);

    return(
        <div className="profile-class">
            <Navbar/>
            <div className="main-profile">
                <Foto fotoURL={fotoURL} setFotoURL={setFotoURL} email={email}/>
                <Dati username={username} setUsername={setUsername} email={email}/>
            </div>
            <div className="riepilogo">
                <h1>Riepilogo attività:</h1>
                <div className="riepilogo_numeri">
                    <div className="mancanti">
                        <h2>Mancanti</h2>
                        <label htmlFor="totali">{mancanti}</label>
                    </div>
                    <div className="totali">
                        <h2>Totali</h2>
                        <label htmlFor="totali">{totali}</label>
                    </div>
                    <div className="completate">
                        <h2>Completate</h2>
                        <label htmlFor="totali">{completate}</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;