
import './Profile.css'

import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext.jsx';

import Navbar from '../../components/NavBar_Profile/navbar.jsx';
import Foto from '../../components/Foto_profile/immagine_profilo.jsx';
import Dati from '../../components/Dati/dati_utente.jsx';


function Profile() {



    const { username, setUsername } = useContext(UserContext);
    //const { email, setEmail } = useContext(UserContext);
    const location = useLocation();

    //conteggio numero attività
    const completate = location.state?.completateCount || 0;
    const totali = location.state?.att_num || 0;
    const mancanti = totali - completate;

    return(
        <div className="profile-class">
            <Navbar/>
            <div className="main-profile">
                <Foto/>
                <Dati username={username} setUsername={setUsername} /*email={email}*//>
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