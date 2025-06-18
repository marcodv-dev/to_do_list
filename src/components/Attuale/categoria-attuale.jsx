
import Swal from 'sweetalert2';
import Calendario from '../Calendario/calendar';
import './categoria-attuale.css'
import { useState, useEffect } from 'react';

function Categoria_attuale ({ categoriaAttiva, onAggiungiAttivita, categorieDisponibili }) {

    const [mostraModale, setMostraModale] = useState(false)
    const [nomeAttivita, setNomeAttivita] = useState('')
    const [dataSelezionata, setDataSelezionata] = useState('')
    const [categoriaSelezionata, setCategoriaSelezionata] = useState(categoriaAttiva ? categoriaAttiva : (categorieDisponibili[0] || null))

    //AGGIORNA CATEGORIA PRESELEZIONATA SELECT
    useEffect(() => {
        if(categoriaAttiva) setCategoriaSelezionata(categoriaAttiva);
        else if (categorieDisponibili.length > 0) setCategoriaSelezionata(categorieDisponibili[0]);
        else setCategoriaSelezionata(null);
    }, [categoriaAttiva, categorieDisponibili]);

    //NUOVA ATTIVITÀ - APRI MODALE
    const apriModale = () => {
        setNomeAttivita('');
        setCategoriaSelezionata(categoriaAttiva && categoriaAttiva !== "mancanti" ? categoriaAttiva : categorieDisponibili[0] || null)
        setMostraModale(true)
    }
    
    //NUOVA ATTIVITÀ - CHIUDI MODALE
    const chiudiModale = () => {
        setMostraModale(false)
        setDataSelezionata('')
    }

    //AGGIUNGI NUOVA ATTIVITÀ
    const confermaAggiunta = () => {
        if(categoriaSelezionata!==''){                  // se c'è una categoria selezionata
            if (nomeAttivita.trim() !== '') {           // se ha inserito un nome per l'attività
                if (dataSelezionata !== '') {           // se ha selezionato una data
                    onAggiungiAttivita(nomeAttivita.trim(), categoriaSelezionata, dataSelezionata);
                    chiudiModale();
                } else avviso("Seleziona una data per l'attività!");
            } else avviso("Inserisci un nome per l'attività!");
        } else avviso("Crea prima una categoria a cui assegnare questa attività!");
    }

    //AVVISO
    const avviso = (text) => {
        Swal.fire({
            title: 'Elementi mancanti!',
            text: text,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#246779',
            confirmButtonText: 'Chiudi',
        });
    }
    
    return(
        <div className='attuale'>
            <h1>{categoriaAttiva && categoriaAttiva.nome? categoriaAttiva.nome : categoriaAttiva || ''}</h1> 
            <button className="button-plus" onClick={apriModale}><img src="/plus_icon.png" alt="" /></button>
            {mostraModale && (
                <div className="modale-conferma"
                    style={{
                        position: 'fixed',
                        top: 0, left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1
                    }}
                >
                    <div className="contenuto-modale" style={{
                        position:'relative',
                        width: '400px',
                        margin: '10% auto',
                        backgroundColor: 'white',
                        padding: '2em',
                        borderRadius: '1em'
                    }}>
                        <h2 style={{
                            color:'#246779',
                            textAlign:'center',
                            marginBottom:'40px'
                        }}>Nuova attività</h2>
                        <input
                            type="text"
                            placeholder="Nome attività"
                            value={nomeAttivita}
                            onChange={(e) => setNomeAttivita(e.target.value)}
                            style={{ 
                                marginLeft:'50%',
                                marginBottom: '30px',
                                padding:'10px 20px',
                                width:'50%',
                                borderRadius:'1em',
                                transform:'translateX(-50%)',
                                border:'1px solid gray',
                                outline:'none'
                            }}
                        />
                        <select
                            value={categoriaSelezionata? JSON.stringify(categoriaSelezionata) : ''}
                            onChange={(e) => {
                                setCategoriaSelezionata(JSON.parse(e.target.value));
                            }}
                            style={{
                                width: '50%',
                                marginBottom: '40px',
                                marginLeft:'50%',
                                transform:'translateX(-50%)',
                                padding:'10px 10px',
                                borderRadius:'1em',
                                backgroundColor:'#246779',
                                color:'white',
                                fontWeight:'bold'
                            }}
                        >
                            {categorieDisponibili.map((cat) => (
                                <option key={cat.id} value={JSON.stringify(cat)}>
                                    {cat.nome}
                                </option>
                            ))}
                        </select>
                        <div className='calendrio-nuova-attivita'>
                            <label htmlFor="data">Seleziona data:</label>
                            <Calendario dataSelezionata={dataSelezionata} setDataSelezionata={(data)=>setDataSelezionata(data)} nuova={false}/>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent:'space-between',
                            margin:'30px 20px auto'
                        }}>
                            <button className='button-a' onClick={chiudiModale}>Annulla</button>
                            <button className='button-a' onClick={confermaAggiunta}>Aggiungi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Categoria_attuale;