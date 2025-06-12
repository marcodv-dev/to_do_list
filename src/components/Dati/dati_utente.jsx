
import './dati_utente.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';

function Dati_utente ({ username, setUsername /*, email */ }) {

    const navigate = useNavigate();
    const [mostraConferma, setMostraConferma] = useState(false);
    const [nuovoUsername, setNuovoUsername] = useState(username);


    const logout = () =>{
        
        Swal.fire({
            title: 'Logout',
            text: 'Sicuro di voler uscire?',
            icon: 'question',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#246779',
            cancelButtonColor: '#246779',
            confirmButtonText: 'Si, esci',
            cancelButtonText: 'Annulla'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/");
            }
        });
    }

    const ChangeUsername = (nuovo) => {
        setNuovoUsername(nuovo);
        if(nuovo!==username && nuovo!==''){
            setMostraConferma(true);
        }else{
            setMostraConferma(false);
        }
    }

    const confermaUsername = () => {
        Swal.fire({
            text: "Confermi di voler cambiare il tuo Username?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#246779',
            cancelButtonColor: '#246779',
            confirmButtonText: 'Sì, cambia',
            cancelButtonText: 'Annulla'
        }).then((result) => {
            if (result.isConfirmed) {
                setUsername(nuovoUsername);

            }else{
                setNuovoUsername(username);
            }
            setMostraConferma(false);
        });
    };

    return (
        <div className="dati">
            <label htmlFor="">email {/*email*/} </label>
            <div>
                <img src="/pen_icon.png" alt="" />
                <input className="username" type="text" name="" id="" value={nuovoUsername} onChange={e => ChangeUsername(e.target.value)}/>
                {mostraConferma && (
                    <button onClick={confermaUsername}>Conferma</button>
                )}
            </div>
            
            <input className="logout" onClick={logout} type="button" value="Logout"/>
        </div>
    );
}

export default Dati_utente;