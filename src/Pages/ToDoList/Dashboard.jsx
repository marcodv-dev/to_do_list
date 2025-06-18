
import './Dashboard.css'
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
    const [termineRicerca, setTermineRicerca] = useState('');
    
    //CARICA INFORMAZIONI UTENTE
    useEffect(() => {
        if (!email) return;
        fetch(`http://localhost:3001/utente/${encodeURIComponent(email)}`)          //DATI DELL'UTENTE
            .then(res => res.json())
            .then(data => {
                setUserInfo(data);
                if(data.foto!=='')
                    setFotoURL(data.foto);
            })
            .catch(err => console.error(err));

        fetch(`http://localhost:3001/categorie/${encodeURIComponent(email)}`)       //CATEGORIE DELL'UTENTE
            .then(res => res.json())
            .then(data => {
                setCategorie(data);
            })
            .catch(err => {
                Swal.fire({
                    text: 'Errore nel caricamento delle categorie',
                    icon: 'error',
                    confirmButtonText: 'Chiudi',
                    confirmButtonColor: '#246779'
                });
            });
            
        fetch(`http://localhost:3001/attivita/${encodeURIComponent(email)}`)        //ATTIVITÀ DELL'UTENTE
            .then(res => res.json())
            .then(data => {
                const attivitaFormattate = data.map(a => ({
                    ...a, data: formatDate(a.data)
                }));
                setAttivita(attivitaFormattate);
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

    //=================================================================================CATEGORIE=================================================================================

    const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);

    //RICARICA CATEGORIE
    const fetchCategorie = async () => {
        try {
            const response = await fetch(`http://localhost:3001/categorie/${encodeURIComponent(email)}`);
            const data = await response.json();
            setCategorie(data);
        } catch (error) {console.error('Errore nel caricamento delle categorie:', error);}
    };
    
    //NUOVA CATEGORIA
    const aggiungiCategoria = async (nomeCategoria) => {
        try {
            const response = await fetch(`http://localhost:3001/categorie/${encodeURIComponent(email)}`);                               //CONTROLLA SE ESISTE GIÀ
            const existingCategories = await response.json();                                                                           
            const exists = existingCategories.some(categoria => categoria.nome.toLowerCase() === nomeCategoria.toLowerCase());          
            if (exists) {                                                                                                               
                avviso('Esiste già una categoria con questo nome!');                                                                    
                return;                                                                                                                 
            }                                                                                                                           
            await fetch('http://localhost:3001/categorie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nomeCategoria, email })
            });
            successo('Categoria aggiunta con successo.');
            fetchCategorie();
        } catch (error) {
            console.error('Errore durante l\'aggiunta della categoria:', error);
            avviso('Errore durante l\'aggiunta della categoria.');
        }
    };

    //MODIFICA CATEGORIA
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
            } else avviso("La categoria esiste già!");
        }else confermaModificaCategoria();
    }

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
            successo('Categoria modificata con successo');
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
    
    //ELIMINA CATEGORIA
    const eliminaCategoria = (categoria) => {
        fetch(`http://localhost:3001/categorie/${categoria.id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            successo('Categoria eliminata con successo');
            setCategorie(prev => prev.filter(cat => cat.id !== categoria.id));
            setAttivita(prev => prev.filter(att => att.categoria_id !== categoria.id))
            setCategoriaSelezionata('');
        })
        .catch(err => console.error('Errore durante l\'eliminazione:', err));
    };

    //=================================================================================ATTIVITÀ=================================================================================    

    //FOTMATTA LE DATE
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    const dateEvidenziate = Array.from(new Set(attivita.map(a => formatDate(a.data)))).map(dateStr => formatDate(dateStr));

    //AGGIUNGI ATTIVITÀ
    const aggiungiAttivita = async (nome, categoria, data) => {
        if (!categoria || !categoria.id) {
            avviso('Seleziona una categoria valida!');
            return;
        }
        const categoriaSelezionata = categorie.find(c => c.id === categoria.id);
        const dataPura = formatDate(data);
        const nuovaAttivita = {
            nome: nome.trim(),
            data: dataPura,
            categoria_id: categoriaSelezionata.id,
            utente_email: email
        };
        try {
            const checkResponse = await fetch(`http://localhost:3001/attivitaEsistente?nome=${nuovaAttivita.nome.trim()}&data=${nuovaAttivita.data}&utente_email=${email}`);    //CONTROLLO ESISTENZA ATTIVITÀ DUPLICATA
            if (!checkResponse.ok) throw new Error('Errore durante il controllo esistenza');
            const attivitaEsistenti = await checkResponse.json();
            if (attivitaEsistenti.esiste) {
                avviso('Attività già esistente per questo utente!');
                return;
            }   
            const response = await fetch('http://localhost:3001/attivita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuovaAttivita)
            });
            if (!response.ok) throw new Error('Errore durante l\'aggiunta');
            const dataResponse = await response.json();
            setAttivita([...attivita, { ...nuovaAttivita, id: dataResponse.id }]);
            setCategoriaSelezionata(categoria);
            successo("Attività aggiunta con successo!");
        } catch (err) {
            console.error('Errore durante l\'aggiunta:', err);
            avviso('Errore durante l\'aggiunta dell\'attività');
        }
    };
    
    //ATTIVITÀ CHECK
    const toggleCompletato = async (attivitaSelezionata) => {       
        const nuovaLista = attivita.map(att => {
            if (att.id === attivitaSelezionata.id) {
                return { ...att, checked: !att.checked };
            }
            return att;
        });
        setAttivita(nuovaLista);
        try {
            await fetch(`http://localhost:3001/attivita-c/${attivitaSelezionata.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checked: !attivitaSelezionata.checked })
            });
        } catch (error) {console.error('Errore durante aggiornamento attività:', error);}
    };

    //MODIFICA ATTIVITÀ
    const [mostraModificaAtt, setMostraModificaAtt] = useState(false);
    const [nomeDaModificareAtt, setNomeDaModificareAtt] = useState('');
    const [nuovoNomeAtt, setnuovoNomeAtt] = useState('');
    const [cambiaDataSelezionata, setCambiaDataSelezionata] = useState(null);
    const [idAttivitaDaModificare, setIdAttivitaDaModificare] = useState(null);
    
    const modificaAttivita = (id,nome,data) => {
        setIdAttivitaDaModificare(id);
        setNomeDaModificareAtt(nome);
        setnuovoNomeAtt(nome);
        setMostraModificaAtt(true);
    }
    const confermaModificaA = () => {

        if((nuovoNomeAtt && nuovoNomeAtt!==nomeDaModificareAtt) || (cambiaDataSelezionata!==undefined && cambiaDataSelezionata!==null && cambiaDataSelezionata!=='') ){  
            const nomeAggiornato = nuovoNomeAtt.trim() !== '' ? nuovoNomeAtt.trim() : nomeDaModificareAtt;
            const dataFormattata = cambiaDataSelezionata? 
                formatDate(cambiaDataSelezionata)
                : (() => {
                    const attivitaVecchia = attivita.find(att => att.id === idAttivitaDaModificare);
                    return formatDate(attivitaVecchia.data);
                })();
            const attivitàEsistente = attivita.some(att =>
                att.id !== idAttivitaDaModificare &&
                att.nome === nomeAggiornato &&
                att.data === dataFormattata
            );
            if(!attivitàEsistente){
                Swal.fire({
                    text: "Sicuro di voler cambiare questa attività?",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#246779',
                    cancelButtonColor: '#246779',
                    confirmButtonText: 'Sì, cambia',
                    cancelButtonText: 'Annulla'
                }).then((result) => {
                    if (result.isConfirmed) confermaModificaAtt();
                });        
            } else avviso('Questa attività esiste già!');   
        }else confermaModificaAtt();
    };
    const confermaModificaAtt = () => {
        const attivitaDaAggiornare = attivita.find(att => att.id === idAttivitaDaModificare);
        if (!attivitaDaAggiornare) {
            avviso('Attività non trovata!');
            return;
        }
        const nomeAggiornato = nuovoNomeAtt.trim() !== '' ? nuovoNomeAtt.trim() : nomeDaModificareAtt;
        const dataAggiornata = cambiaDataSelezionata !== undefined && cambiaDataSelezionata !== null && cambiaDataSelezionata !== ''
            ? formatDate(cambiaDataSelezionata)
            : (() => {
                return formatDate(attivitaDaAggiornare.data);
            })();
        setAttivita(
            attivita.map((att) =>
                att.id === idAttivitaDaModificare ? 
                { ...att, nome: nomeAggiornato, data: dataAggiornata } : att
            )
        );
        fetch(`http://localhost:3001/attivita/${attivitaDaAggiornare.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nomeAggiornato,
                data: formatDate(dataAggiornata)
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

    //ELIMINA ATTIVITÀ
    const eliminaAttivita = (attivita) => {
        fetch(`http://localhost:3001/attivita/${attivita.id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            successo('Attività eliminata con successo');
            setAttivita(prev => prev.filter(att => att.id !== attivita.id));
        })
        .catch(err => console.error('Errore durante l\'eliminazione:', err));
    };

    //ATTENZIONE CAREGORIA-ATTIVITÀ
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
                if(tipo==="categoria") eliminaCategoria(elemento);
                else if(tipo==="attivita") eliminaAttivita(elemento);
            }
        });
    };

    //SUCCESSO
    const successo = (element) => {
        Swal.fire({
            title: element,
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: '1000'
        });
    }

    //PROFILO
    const Profilo = () => {
        const att_num = attivita.length;
        //const completateCount = attivitaCompletate ? Object.values(attivitaCompletate).filter(val => val).length : 0;
        //qui non voglio che controlli attivitaCompletate ma direttamente il checked nel database
        const completateCount = attivita.filter(att => att.checked).length;
        navigate("/Profile", { state: {completateCount, att_num} });
    }

    //AVVISO
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
                            if(data === null || formatDate(data) === formatDate(a.data)){
                                if (!categoria_mod) return true;
                                const cat = categoria_mod;
                                if (cat === "mancanti") return !a.checked;
                                return (a.categoria_id || '') === cat;
                            }
                            else return false;                            
                        }))
                        .filter(
                            a => (a.nome || '').toLowerCase().includes((termineRicerca || "").trim().toLowerCase())
                        )
                        .sort((a, b) => new Date(a.data) - new Date(b.data))
                    }
                    categoriaAttiva={categoriaSelezionata}
                    onToggleCompletato={toggleCompletato}
                    onEliminaAttivita={(attivita) => handleDelete(attivita, "attivita")}
                    onModificaAttivita={(id,nome,data) => modificaAttivita(id,nome,data)}
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