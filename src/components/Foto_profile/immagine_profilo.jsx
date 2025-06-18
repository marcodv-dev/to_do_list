
import './immagine-profilo.css'
import { useState } from 'react';
import { useRef } from 'react';
import Swal from 'sweetalert2';

function Foto_profilo ( {fotoURL , setFotoURL, email} ) {

    const [mostraModifica, setMostraModifica] = useState(false);
    const fileInputRef = useRef(null);

    
    //FINESTRA INPUT FILE
    const handleClick = () => {
        fileInputRef.current.click(); 
    };

    //MOSTRA CONFERMA MODIFICA FOTO
    const modifica = () => {
        setMostraModifica(true);
    }

    //ESCI MODIFICA FOTO
    const indietro_foto = () => {
        setMostraModifica(false);
    }

    //MODIFICA FOTO
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setMostraModifica(false);
        if (file) {
            Swal.fire({
                title: 'Cambia foto profilo',
                text: 'Sicuro di voler cambiare la foto profilo?',
                icon: 'question',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonColor: '#246779',
                cancelButtonColor: '#246779',
                confirmButtonText: 'Si, cambia',
                cancelButtonText: 'Annulla'
            }).then((result) => {
                if (result.isConfirmed) {
                    const formData = new FormData();
                    formData.append('foto', file);
                    
                    fetch(`http://localhost:3001/utente/foto/${email}`, {
                        method: 'PUT',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(data => setFotoURL(data.fotoURL))
                    .catch(err => console.error('Errore durante il salvataggio della foto:', err));

                    caricatoSuccesso();
                }
            });
        }
    };

    //ELIMINA FOTO
    const elimina_foto = () => {
        if(fotoURL !== ""){
            setMostraModifica(false);
            Swal.fire({
                title: 'Elimina foto profilo',
                text: 'Sicuro di voler eliminare la foto profilo?',
                icon: 'question',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonColor: 'rgb(191,0,0)',
                cancelButtonColor: '#246779',
                confirmButtonText: 'Si, elimina',
                cancelButtonText: 'Annulla'
            }).then((result) => {
                if (result.isConfirmed) {
                    setFotoURL("");
                    eliminatoSuccesso();
                    
                    fetch(`http://localhost:3001/utente/foto/${email}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ foto: '' })
                    })
                    .then(res => res.json())
                    .catch(err => console.error('Errore durante l\'eliminazione della foto:', err));        
                }
            });
        }
    }
    
    //ELIMINATO SUCCESSO
    const eliminatoSuccesso = () => {
        Swal.fire({
            title: 'Eliminato!',
            text: "Elemento eliminato con successo",
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: '1000'
        });
    }

    //CARICATO SUCCESSO
    const caricatoSuccesso = () => {
        Swal.fire({
            title: 'Caricata!',
            text: "Elemento caricato con successo",
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: '1000'
        });
    }
    
    return (
        <div className="foto">
            <img className="immagine_profilo" src={fotoURL ? `http://localhost:3001${fotoURL}` : '/profile_icon.png'} alt="" />
            <button className="modifica_foto" onClick={modifica}>Modifica foto profilo</button>

            {mostraModifica && (
                <div className="modale-conferma"
                style={{
                    width:'100vw',
                    height:'100vh',
                    position:'fixed',
                    top:'0',left:'0',
                    zIndex:'1',
                    backgroundColor:'rgba(0,0,0,0.5)'
                }}
                >
                    <div className="contenuto-foto" style={{
                        width:'600px',
                        border:'1px solid black',
                        backgroundColor:'white',
                        padding:'20px',
                        borderRadius:'2em',
                        margin:'10% 50%',
                        transform:'translateX(-50%)',
                        display:'flex',
                        flexDirection:'column',
                    }}>
                        <div className="head" style={{
                            display:'flex',
                            justifyContent:'space-between',
                        }}>
                            <h1 style={{
                                marginBottom:'20px',
                                textTransform:'capitalize'
                            }}>modifica foto profilo</h1>
                            <button onClick={indietro_foto} style={{
                                width:'40px',
                                height:'40px',
                                border:'none',
                                background:'none'
                            }}><img src="x_icon.png" alt="" style={{width:'20px'}}/></button>
                        </div>
                            <img style={{
                            margin:'40px auto',
                            height:'300px',
                            width:'300px',
                            borderRadius:'0.5em',
                            objectFit: 'cover',
                            objectPosition: 'center'
                        }} src={fotoURL ? `http://localhost:3001${fotoURL}` : '/profile_icon.png'} alt="" />
                        <div style={{
                            display:'flex',
                            }}>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <button onClick={handleClick} style={{
                                margin:'auto',
                                padding:'10px 10px',
                                fontSize:'16px',
                                borderRadius:'2em',
                                backgroundColor:'white',
                                border:'none',
                                color:'black'
                            }}>Carica una nuova foto</button>
                            <button onClick={elimina_foto} style={{
                                margin:'auto',
                                padding:'10px 10px',
                                fontSize:'16px',
                                borderRadius:'2em',
                                backgroundColor:'white',
                                border:'none',
                            }}>Elimina la foto profilo</button>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default Foto_profilo;