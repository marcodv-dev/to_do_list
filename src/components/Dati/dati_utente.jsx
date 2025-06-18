
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


    const elimina_utente = () => {
        Swal.fire({
            title: 'Elimina Account',
            text: 'Sicuro di voler eliminare l\'account? Tutti i dati andranno persi.',
            icon: 'question',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: 'rgb(191, 0, 0)',
            cancelButtonColor: '#246779',
            confirmButtonText: 'Si, elimina',
            cancelButtonText: 'Annulla'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3001/utente/elimina/${encodeURIComponent(email)}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore nella modifica');
                    }
                console.log("si")
                    return response.json();
                })
                .then(() => {
                    successo('Eliminato','Account eliminato con successo!');
                    navigate("/");
                })
                .catch((error) => {
                    console.error(error);
                    avviso('Errore durante l\'aggiornamento dell\'utente.');
                });
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
            successo('Modificato','Username aggiornato con successo!');
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
                successo('Modificato', 'Utente modificato coon successo');

            }else{
                setNuovoUsername(username);
            }
            setMostraConferma(false);
        });
    };

    const successo = (title, text) => {
        Swal.fire({
            title: title,
            text: text,
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
            <input className="elimina-utente" onClick={elimina_utente} type="button" value="Elimina account"/>
        </div>
    );
}

export default Dati_utente;