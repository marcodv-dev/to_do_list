
import './immagine-profilo.css'
import { useState, useContext } from 'react';
import { useRef } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import Swal from 'sweetalert2';

function Foto_profilo () {

    const { foto, setFoto } = useContext(UserContext);
    const [mostraModifica, setMostraModifica] = useState(false);

    const eliminatoSuccesso = () => {
        Swal.fire({
            title: 'Eliminato!',
            text: "Elemento eliminato con successo",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#246779',
            confirmButtonText: 'Chiudi',
        });
    }
    const caricatoSuccesso = () => {
        Swal.fire({
            title: 'Caricata!',
            text: "Elemento caricato con successo",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#246779',
            confirmButtonText: 'Chiudi',
        });
    }

    //MODIFICA FOTO--------------------------------------------------------------------------------------------------------
    const modifica = () => {
        setMostraModifica(true);
    }

    //cabia foto
    const handleClick = () => {
        // apre la finestra di selezione file
        fileInputRef.current.click(); 
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(URL.createObjectURL(file));
            setMostraModifica(false);
            caricatoSuccesso();
        }
    };

    const fileInputRef = useRef(null);

    //elimina foto
    const elimina_foto = () => {
        if(foto !== "/profile_icon.png"){
            setFoto("/profile_icon.png");
            setMostraModifica(false);
            eliminatoSuccesso();
        }
    }

    //esci modifica foto
    const indietro_foto = () => {
        setMostraModifica(false);
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="foto">
            {foto && (
                <img className="immagine_profilo" src={foto} alt="" />
            )}
            <button className="modifica_foto" onClick={modifica}>Modifica foto profilo</button>
            {/* <input type="file" name="foto" id="" /> */}


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
                        {foto && (
                            <img style={{
                            margin:'40px auto',
                            height:'300px',
                            width:'300px',
                            borderRadius:'0.5em',
                            objectFit: 'cover',
                            objectPosition: 'center'
                        }} src={foto} alt="" />
                        )}
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