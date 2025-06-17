
import './Dashboard.css'
//import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext.jsx';
import Swal from 'sweetalert2';

import ToDoTitle from '../../components/ToDoTitle/to-do-title.jsx';
import Categorie from '../../components/Categorie/categorie.jsx';
import CategoriaAttuale from '../../components/Attuale/categoria-attuale.jsx';
import ElencoAttivita from '../../components/Elenco/elenco-attivita.jsx';
import Search from '../../components/Cerca/search.jsx';
import Progressi from '../../components/Progressi/progress.jsx';
import Calendario from '../../components/Calendario/calendar.jsx';

function Dashboard() {

    const navigate = useNavigate();

    const { email, loading } = useContext(UserContext);
    const { fotoURL, setFotoURL } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState(null);
    const [categorie, setCategorie] = useState([]);




    const [dataSelezionata, setDataSelezionata] = useState(null);
    const [attivita, setAttivita] = useState([]);
    const dateEvidenziate = Array.from(new Set(attivita.map(a => new Date(a.data).toDateString()))).map(dateStr => new Date(dateStr));

    
    // Carica informazioni utente
    useEffect(() => {

        if (!email) return;

        fetch(`http://localhost:3001/utente/${encodeURIComponent(email)}`)
                .then(res => res.json())
                .then(data => {
                    setUserInfo(data);
                    if(data.foto!=='')
                        setFotoURL(data.foto);
                })
                .catch(err => console.error(err));

            fetch(`http://localhost:3001/categorie/${encodeURIComponent(email)}`)
                .then(res => res.json())
                .then(data => {
                    setCategorie(data);
                })
                .catch(err => {
                    // Se c'è un errore, lo mostra in console
                    console.error('Errore nel recupero delle categorie:', err);
                    // Mostra un avviso all'utente
                    Swal.fire({
                        text: 'Errore nel caricamento delle categorie',
                        icon: 'error',
                        confirmButtonText: 'Chiudi',
                        confirmButtonColor: '#246779'
                    });
                });
            
            fetch(`http://localhost:3001/attivita/${encodeURIComponent(email)}`)
                .then(res => res.json())
                .then(data => {
                    setAttivita(data); // Assicurati di avere useState per attivita
                })
                .catch(err => {
                    console.error('Errore nel recupero delle attività:', err);
                    Swal.fire({
                        text: 'Errore nel caricamento delle attività',
                        icon: 'error',
                        confirmButtonText: 'Chiudi',
                        confirmButtonColor: '#246779'
                    });
                });
        
    }, [email, loading]);

    
    const [termineRicerca, setTermineRicerca] = useState('');


    // // CATEGORIE --------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);

    //ricarica le categorie
    const fetchCategorie = async () => {
        try {
            const response = await fetch(`http://localhost:3001/categorie/${encodeURIComponent(email)}`);
            const data = await response.json();
            setCategorie(data);
        } catch (error) {
            console.error('Errore nel caricamento delle categorie:', error);
        }
    };
    
    // //aggiungi nuova
    const aggiungiCategoria = async (nomeCategoria) => {
        try {
            // Verifica se esiste già una categoria con lo stesso nome per quell'utente
            const response = await fetch(`http://localhost:3001/categorie/${encodeURIComponent(email)}`);
            const existingCategories = await response.json();

            const exists = existingCategories.some(categoria => categoria.nome.toLowerCase() === nomeCategoria.toLowerCase());
            if (exists) {
                avviso('Esiste già una categoria con questo nome!');
                return;
            }

            // Se non esiste, la aggiungo
            await fetch('http://localhost:3001/categorie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nomeCategoria, email })
            });

            successo('Categoria aggiunta con successo.');
            // Ricarica le categorie
            fetchCategorie();
        } catch (error) {
            console.error('Errore durante l\'aggiunta della categoria:', error);
            avviso('Errore durante l\'aggiunta della categoria.');
        }
    };

    // //modifica categoria
    const [mostraModificaCategoria, setMostraModificaCategoria] = useState(false);
    const [nomeDaModificareCategoria, setNomeDaModificareCategoria] = useState('');
    const [nuovoNomeCategoria, setnuovoNomeCategoria] = useState('');


    const ModificaCategoria = (nome) => {
        setNomeDaModificareCategoria(nome);
        setnuovoNomeCategoria(nome);
        setMostraModificaCategoria(true);
    }

    const confermaModificaC= () => {
        if((nuovoNomeCategoria && nuovoNomeCategoria!==nomeDaModificareCategoria)){
            if (!categorie.some(c => c.nome === nuovoNomeCategoria)) {
                Swal.fire({
                    text: "Sicuro di voler cambiare questa categoria?",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#246779',
                    cancelButtonColor: '#246779',
                    confirmButtonText: 'Sì, cambia',
                    cancelButtonText: 'Annulla'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const categoriaDaModificare = categorie.find(c => c.nome === nomeDaModificareCategoria);
                        const categoriaAggiornata = { ...categoriaDaModificare, nome: nuovoNomeCategoria };
                        confermaModificaCategoria(categoriaAggiornata);
                        successo("Categoria modificata con successo!");
                    }
                });    
            } else {
                avviso("La categoria esiste già!");
            }
        }else{
            confermaModificaCategoria();
        }
    };

    const confermaModificaCategoria = (categoria) => {
        
        fetch(`http://localhost:3001/categorie/${categoria.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nuovoNomeCategoria })
        })
        .then(res => res.json())
        .then(data => {

            setCategorie(
                categorie.map((cat) => 
                    cat.id === categoria.id ? { ...cat, nome: nuovoNomeCategoria } : cat
                )
            );
            setAttivita(
                attivita.map((att) =>
                    att.categoria === nomeDaModificareCategoria && nuovoNomeCategoria!=='' ? { ...att, categoria: nuovoNomeCategoria } : att
                )
            );

            // Aggiorno la lista delle categorie nello stato
            setCategorie(prevCategorie => 
                prevCategorie.map(c => 
                    c.id === categoria.id ? { ...c, nome: categoria.nome } : c
                )
            );
            successo('Categoria modificata con successo');
            // Aggiorno la categoria nello stato locale
            setCategorie(prev => prev.map(cat => cat.id === categoria.id ? { ...cat, nome: categoria.nome } : cat));
        })
        .catch(err => console.error('Errore durante la modifica:', err));

        fetchCategorie();
        setCategoriaSelezionata({
            ...categoria,
            nome: nuovoNomeCategoria !== '' ? nuovoNomeCategoria : categoriaSelezionata.nome
        });
        setNomeDaModificareCategoria("");
        setnuovoNomeCategoria("");
        setMostraModificaCategoria(false);
    }
    useEffect(() => {
        if (categoriaSelezionata) {
            const categoriaAggiornata = categorie.find(cat => cat.id === categoriaSelezionata.id);
            if (categoriaAggiornata) {
                setCategoriaSelezionata(categoriaAggiornata);
            }
        }
    }, [categorie]);
    
    const eliminaCategoria = (categoria) => {
        fetch(`http://localhost:3001/categorie/${categoria.id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            successo('Categoria eliminata con successo');
            // Rimuovo la categoria dallo stato locale
            setCategorie(prev => prev.filter(cat => cat.id !== categoria.id));
            setAttivita(prev => prev.filter(att => att.categoria_id !== categoria.id))
            setCategoriaSelezionata('');
        })
        .catch(err => console.error('Errore durante l\'eliminazione:', err));
    };

    // //ATTIVITÀ  ------------------------------------------------------------------------------------------------------------------------------
    //const [attivitaCompletate, setAttivitaCompletate] = useState({});
    
    // //aggiungi nuova
    const aggiungiAttivita = async (nome, categoria, data) => {
        
        if (!categoria || !categoria.id) {
            avviso('Seleziona una categoria valida!');
            return;
        }
        const categoriaSelezionata = categorie.find(c => c.id === categoria.id);
        const dataPura = new Date(data).toISOString().split('T')[0];

        const nuovaAttivita = {
            nome: nome.trim(),
            data: dataPura,
            categoria_id: categoriaSelezionata.id,
            utente_email: email // Assumendo che tu abbia la mail utente salvata nello stato
        };

        //qua voglio un fetch che controlli che non esista un'altra attività con lo stesso nome e la stessa email, se è così esegue avviso('già esistente') e non completa questa funzione
        

        try {

            // Verifica se esiste già un'attività con lo stesso nome per lo stesso utente
            const checkResponse = await fetch(`http://localhost:3001/attivitaEsistente?nome=${nuovaAttivita.nome.trim()}&utente_email=${email}`);
            
            
            if (!checkResponse.ok) throw new Error('Errore durante il controllo esistenza');

            const attivitaEsistenti = await checkResponse.json();

            if (attivitaEsistenti.esiste) {
                avviso('Attività già esistente per questo utente!');
                return; // Interrompo la funzione se già esiste
            }    


            const response = await fetch('http://localhost:3001/attivita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuovaAttivita)
            });

            if (!response.ok) throw new Error('Errore durante l\'aggiunta');

            const dataResponse = await response.json();

            // Aggiorna lo stato locale con la nuova attività (includi l'id restituito dal DB)
            setAttivita([...attivita, { ...nuovaAttivita, id: dataResponse.id }]);
            setCategoriaSelezionata(categoria);
            successo("Attività aggiunta con successo!");
        } catch (err) {
            console.error('Errore durante l\'aggiunta:', err);
            avviso('Errore durante l\'aggiunta dell\'attività');
        }
    };
    
    //checked
    const toggleCompletato = async (attivitaSelezionata) => {
        
        const nuovaLista = attivita.map(att => {
            if (att.id === attivitaSelezionata.id) {
                return { ...att, checked: !att.checked }; // aggiorno stato locale
            }
            return att;
        });

        setAttivita(nuovaLista); // aggiorno stato locale per rimuovere il check senza ricaricare la pagina
        try {
            await fetch(`http://localhost:3001/attivita-c/${attivitaSelezionata.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checked: !attivitaSelezionata.checked }) // aggiorno anche nel database
            });
        } catch (error) {
            console.error('Errore durante aggiornamento attività:', error);
        }
    };


    // //modifica attività
    const [mostraModificaAtt, setMostraModificaAtt] = useState(false);
    const [nomeDaModificareAtt, setNomeDaModificareAtt] = useState('');
    const [nuovoNomeAtt, setnuovoNomeAtt] = useState('');
    const [cambiaDataSelezionata, setCambiaDataSelezionata] = useState(null);
    
    const modificaAttivita = (nome,data) => {

        setNomeDaModificareAtt(nome);
        setnuovoNomeAtt(nome);
        setCambiaDataSelezionata(data);
        setMostraModificaAtt(true);
    }

    const confermaModificaA = () => {
        if((nuovoNomeAtt && nuovoNomeAtt!==nomeDaModificareAtt) || (cambiaDataSelezionata!==undefined && cambiaDataSelezionata!==null && cambiaDataSelezionata!=='') ){
            if (!attivita.some(att => att.nome === nuovoNomeAtt) || nuovoNomeAtt===nomeDaModificareAtt) { // se non esiste un'altra con lo stesso nome
                Swal.fire({
                    text: "Sicuro di voler cambiare questa attività?",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#246779',
                    cancelButtonColor: '#246779',
                    confirmButtonText: 'Sì, cambia',
                    cancelButtonText: 'Annulla'
                }).then((result) => {
                    if (result.isConfirmed) {
                        confermaModificaAtt();
                    }
                });        
            } else {
                avviso('Questa attività esiste già!');
            }
            
        }else{
            confermaModificaAtt();
        }
    };

    

    const confermaModificaAtt = () => {

        // Trova l'attività da aggiornare
        const attivitaDaAggiornare = attivita.find(att => att.nome === nomeDaModificareAtt);

        if (!attivitaDaAggiornare) {
            avviso('Attività non trovata!');
            return;
        }

        const nomeAggiornato = nuovoNomeAtt.trim() !== '' ? nuovoNomeAtt.trim() : nomeDaModificareAtt;
        const dataAggiornata = cambiaDataSelezionata !== undefined && cambiaDataSelezionata !== null && cambiaDataSelezionata !== '' 
            ? new Date(cambiaDataSelezionata) 
            : new Date(attivitaDaAggiornare.data);

        // Aggiornamento lato client
        setAttivita(
            attivita.map((att) =>
                att.nome === nomeDaModificareAtt
                    ? { ...att, nome: nomeAggiornato, data: dataAggiornata }
                    : att
            )
        );

        // Aggiornamento nel database
        fetch(`http://localhost:3001/attivita/${attivitaDaAggiornare.id}`, {  // Assicurati che l'ID sia disponibile
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nomeAggiornato,
                data: dataAggiornata.toISOString().split('T')[0] // formato yyyy-mm-dd
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nella modifica');
            }
            return response.json();
        })
        .then(() => {
            successo('Attività aggiornata con successo!');
        })
        .catch((error) => {
            console.error(error);
            avviso('Errore durante l\'aggiornamento dell\'attività.');
        });
            
        setNomeDaModificareAtt("");
        setnuovoNomeAtt("");
        setCambiaDataSelezionata(null);
        setMostraModificaAtt(false);
    }

    // //elimina  attività
    const eliminaAttivita = (attivita) => {
        fetch(`http://localhost:3001/attivita/${attivita.id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            successo('Attività eliminata con successo');
            // Rimuovo la categoria dallo stato locale
            setAttivita(prev => prev.filter(att => att.id !== attivita.id));
        })
        .catch(err => console.error('Errore durante l\'eliminazione:', err));
    };

    // //Conferma eliminazione categoria e attività-------------------------------------------------------------------------------------------------------
    const handleDelete = (elemento, tipo) => {
        Swal.fire({
            title: 'Sei sicuro?',
            text: "Potresti perdere dei dati!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(191, 0, 0)',
            cancelButtonColor: '#246779',
            confirmButtonText: 'Sì, elimina!',
            cancelButtonText: 'Annulla'
        }).then((result) => {
            if (result.isConfirmed) {
            
                if(tipo==="categoria")
                    eliminaCategoria(elemento);
                else if(tipo==="attivita")
                    eliminaAttivita(elemento);
                eliminatoSuccesso();
            }
        });
    };

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

    //comferma modifica categoria e attività
    const successo = (element) => {
        Swal.fire({
            title: element,
            // text: element+" modificata con successo",
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: '1000'
        });
    }

    //Profilo ------------------------------------------------------------------------------------------------------------------------------
    const Profilo = () => {
        const att_num = attivita.length;
        //const completateCount = attivitaCompletate ? Object.values(attivitaCompletate).filter(val => val).length : 0;
        //qui non voglio che controlli attivitaCompletate ma direttamente il checked nel database
        const completateCount = attivita.filter(att => att.checked).length;
        navigate("/Profile", { state: {completateCount, att_num} });
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


    if(loading){
        return <div>Caricamento...</div>
    }

    if (!userInfo) {
        return <div>Caricamento...</div>;
    }


    //------------------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    return (
    <div className="Dashboard-class">
        <div className="header">
            <h1>Ciao {userInfo.username}, programmi per oggi? </h1>
            <div class="options">

                <Calendario
                    dataSelezionata={dataSelezionata}
                    setDataSelezionata={(data)=>setDataSelezionata(data)}
                    nuova={true}
                    highlightDates={dateEvidenziate || null}
                />
                <img className="profile" src={fotoURL ? `http://localhost:3001${fotoURL}` : '/profile_icon.png'} alt="" onClick={Profilo}/>
            </div>
        </div>

        <div className="main">
            <div className="sezione-1">
                <ToDoTitle/>
                <Categorie
                    categorie={categorie}
                    onClickCategoria={(categoria) => setCategoriaSelezionata(categoria)}
                    onAggiungiCategoria={(x) => aggiungiCategoria(x)}
                    onRimuoviCategoria={(categoria) => handleDelete(categoria, "categoria")}
                    onModificaCategoria={(nome) => ModificaCategoria(nome)}
                    avviso={(text) => avviso(text)}
                />
            </div>
            <div className="sezione-2">
                <CategoriaAttuale 
                    categoriaAttiva={categoriaSelezionata} 
                    onAggiungiAttivita={aggiungiAttivita}
                    categorieDisponibili={categorie}
                />
                <ElencoAttivita
                    attivita={
                    attivita
                        .filter((a => {
                            const data = dataSelezionata;
                            const categoria_mod = categoriaSelezionata?.id? categoriaSelezionata.id : categoriaSelezionata==='mancanti'? 'mancanti' : '';


                            if(data === null || new Date(data).getTime() === new Date(a.data).getTime()){
                                if (!categoria_mod) return true;

                                const cat = categoria_mod;

                                if (cat === "mancanti") {
                                    // Mostra solo attività non completate
                                    return !a.checked;
                                }
                                return (a.categoria_id || '') === cat;
                            }
                            else{
                                return false;
                            }
                            
                        }))
                        .filter(
                            a => (a.nome || '').toLowerCase().includes((termineRicerca || "").trim().toLowerCase())
                        )

                        .sort((a, b) => new Date(a.data) - new Date(b.data))
                    }
                    categoriaAttiva={categoriaSelezionata}
                    onToggleCompletato={toggleCompletato}
                    onEliminaAttivita={(attivita) => handleDelete(attivita, "attivita")}
                    onModificaAttivita={(nome,data) => modificaAttivita(nome,data)}
                    categorie={categorie}

                />
            </div>

                 <div className="sezione-3">
                <Search onCerca={setTermineRicerca} />
               <Progressi 
                    attivita={attivita} 
                    //attivitaCompletate={attivitaCompletate} 
                    attivitaCompletate={attivita.filter(att => att.checked).length} 
                    onClickCategoria={(nome) => setCategoriaSelezionata('mancanti')} 
                    categorie={categorie}
                />
            </div> 
        </div>

            {/* MOSTRA MODIFICA  ------------------------------------------------------------------------------------------------------------------------------ */}
            {mostraModificaCategoria && (
                <div className='mostra-modifica'
                style={{
                    width:'100vw',
                    height:'100vh',
                    position:'fixed',
                    top:'0',left:'0',
                    zIndex:'1',
                    backgroundColor:'rgba(0,0,0,0.5)'
                }}>
                    <div className='modifica-box' style={{
                            width: '400px',
                            margin: '10% auto',
                            backgroundColor: 'white',
                            padding: '20px 40px',
                            borderRadius: '1em',
                            display:'flex',
                            flexDirection:'column'
                        }}>
                        <h1 style={{marginBottom:'20px'}}>Modifica</h1>
                        <div className="modifica_cat" style={{
                            display:'flex',
                            gap:'5px',
                            margin:'50px auto',
                            padding:'10px',
                            border:'1px solid lightgray',
                            borderRadius:'2em'
                        }}>
                            <img src="/pen_icon.png" alt="" style={{
                                width:'20px',
                                margin:'auto 0'
                            }} />
                            <input type="text" value={nuovoNomeCategoria /*!== ''? nuovoNomeCategoria : nomeDaModificareCategoria*/} onChange={(e) => setnuovoNomeCategoria(e.target.value)} style={{
                                padding:'0px 20px',
                                margin:'auto 0',
                                border:'none',
                                outline:'none',
                                fontSize:'20px'
                            }} />
                        </div>
                        <div className='button-mod-d'>
                            <button className='button-mod' onClick={() => {setMostraModificaCategoria(false); setNomeDaModificareCategoria(""); setnuovoNomeCategoria("");}}>Annulla</button>
                            <button className='button-mod' onClick={confermaModificaC} disabled={!(nuovoNomeCategoria && nuovoNomeCategoria.trim() !== '' && nuovoNomeCategoria!== nomeDaModificareCategoria)}>Conferma</button>
                        </div>
                    </div>
                </div>
            )}    
            {/* MOSTRA ATTIVITÀ  ------------------------------------------------------------------------------------------------------------------------------ */}
            {mostraModificaAtt && (
                <div className='mostra-modifica'
                style={{
                    width:'100vw',
                    height:'100vh',
                    position:'fixed',
                    top:'0',left:'0',
                    zIndex:'1',
                    backgroundColor:'rgba(0,0,0,0.5)'
                }}>
                    <div className='modifica-box' style={{
                            width: '400px',
                            margin: '10% auto',
                            backgroundColor: 'white',
                            padding: '20px 40px',
                            borderRadius: '1em',
                            display:'flex',
                            flexDirection:'column'
                        }}>
                        <h1 style={{marginBottom:'20px'}}>Modifica</h1>
                        <div className="modifica_cat" style={{
                            display:'flex',
                            gap:'5px',
                            margin:'50px auto',
                            padding:'10px',
                            border:'1px solid lightgray',
                            borderRadius:'2em'
                        }}>
                            <img src="/pen_icon.png" alt="" style={{
                                width:'20px',
                                margin:'auto 0'
                            }} />
                            <input type="text" value={nuovoNomeAtt/* ? nuovoNomeAtt : nomeDaModificareAtt*/} onChange={(e) => setnuovoNomeAtt(e.target.value)} style={{
                                padding:'0px 20px',
                                margin:'auto 0',
                                border:'none',
                                outline:'none',
                                fontSize:'20px'
                            }} />

                        </div>
                            {/* calendario per selezionare una data */}
                            <div className='calendrio-nuova-attivita'>
                                <label htmlFor="data">Seleziona data:</label>
                                <Calendario dataSelezionata={cambiaDataSelezionata} setDataSelezionata={setCambiaDataSelezionata} nuova={false}/>
                            </div>
                            <div className='button-mod-d'>
                                <button className='button-mod' onClick={() => {setMostraModificaAtt(false); setNomeDaModificareAtt(""); setnuovoNomeAtt(""); setCambiaDataSelezionata(null)}}>Annulla</button>
                                <button className='button-mod' onClick={confermaModificaA} disabled={!(nuovoNomeAtt && nuovoNomeAtt.trim() !== '' && (nomeDaModificareAtt!==nuovoNomeAtt || cambiaDataSelezionata!==undefined))}>Conferma</button>
                            </div>
                    </div>
                </div>
            )}

            </div>


    );
}



export default Dashboard; 