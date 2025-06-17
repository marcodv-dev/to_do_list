
import './dati_utente.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';

function Dati_utente ({ username, setUsername , email }) {

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
            confirmButtonColor: 'rgb(191, 0, 0)',
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

    const cambiaUsername = () => {
        fetch(`http://localhost:3001/utente/aggiorna/${encodeURIComponent(email)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: nuovoUsername })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nella modifica');
            }
            return response.json();
        })
        .then(() => {
            successo('Username aggiornato con successo!');
        })
        .catch((error) => {
            console.error(error);
            avviso('Errore durante l\'aggiornamento dell\'utente.');
        });
    }

    const confermaUsername = () => {
        Swal.fire({
            text: "Sicuro di voler cambiare il tuo Username?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#246779',
            cancelButtonColor: '#246779',
            confirmButtonText: 'Sì, cambia',
            cancelButtonText: 'Annulla'
        }).then((result) => {
            if (result.isConfirmed) {
                setUsername(nuovoUsername);
                cambiaUsername();
                successo();

            }else{
                setNuovoUsername(username);
            }
            setMostraConferma(false);
        });
    };

    const successo = () => {
        Swal.fire({
            title: 'Modificato!',
            text: "Username modificato con successo",
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: '1000'
        });
    }
    const avviso = (text) => {
        Swal.fire({
            text: text,
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#246779',
            confirmButtonText:'Chiudi'
        });
    }

    return (
        <div className="dati">
            <label htmlFor=""> {email} </label>
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