
import './Dashboard.css'
//import { useLocation } from "react-router-dom";
import { useState/*, useEffect*/ } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext.jsx';

import ToDoTitle from '../../components/ToDoTitle/to-do-title.jsx';
import Categorie from '../../components/Categorie/categorie.jsx';
import CategoriaAttuale from '../../components/Attuale/categoria-attuale.jsx';
import ElencoAttivita from '../../components/Elenco/elenco-attivita.jsx';
import Search from '../../components/Cerca/search.jsx';
import Progressi from '../../components/Progressi/progress.jsx';
import Calendario from '../../components/Calendario/calendar.jsx';

function Dashboard() {

    const navigate = useNavigate();

    const { username } = useContext(UserContext);
    const { foto } = useContext(UserContext);
    const { categorie, setCategorie } = useContext(UserContext);
    const { attivita, setAttivita } = useContext(UserContext);
    
    
    const [termineRicerca, setTermineRicerca] = useState('');
    const [dataSelezionata, setDataSelezionata] = useState(null);

    const dateEvidenziate = Array.from(new Set(attivita.map(a => new Date(a.data).toDateString()))).map(dateStr => new Date(dateStr));

    // CATEGORIE ------------------------------------------------------------------------------------------------------------------------------

    const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
    
    //aggiungi nuova
    const aggiungiCategoria = (nomeCategoria) => {
        if (!categorie.includes(nomeCategoria)) {
            setCategorie([...categorie, nomeCategoria]);
        } else {
            alert("La categoria esiste già!");
        }
    };

    //modifica attività
    const [mostraModificaCategoria, setMostraModificaCategoria] = useState(false);
    const [nomeDaModificareCategoria, setNomeDaModificareCategoria] = useState('');
    const [nuovoNomeCategoria, setnuovoNomeCategoria] = useState('');

    const ModificaCategoria = (nome) => {
        setNomeDaModificareCategoria(nome);
        setnuovoNomeCategoria(nome);
        setMostraModificaCategoria(true);
    }

    const confermaModificaCategoria = () => {
        setCategorie(
            categorie.map((nome) => 
                nome === nomeDaModificareCategoria && nuovoNomeCategoria!=='' ? nuovoNomeCategoria : nome
            )
        );
        setAttivita(
            attivita.map((att) =>
                att.categoria === nomeDaModificareCategoria && nuovoNomeCategoria!=='' ? { ...att, categoria: nuovoNomeCategoria } : att
            )
        );
        setCategoriaSelezionata(nuovoNomeCategoria!=='' ? nuovoNomeCategoria : categoriaSelezionata)
        setNomeDaModificareCategoria("");
        setnuovoNomeCategoria("");
        setMostraModificaCategoria(false);
    }

    //elimina categoria
    const [mostraConferma, setMostraConferma] = useState(false);

    const confermaEliminazione = (nome) => {
        setNomeDaEliminare(nome);
        setMostraConferma(true);
    };

    const [nomeDaEliminare, setNomeDaEliminare] = useState(null);

    const procediConEliminazione = () => {
        eliminaCategoria(nomeDaEliminare); // elimina correttamente
        setMostraConferma(false);
        setNomeDaEliminare(null);
    };

    const annullaEliminazione = () => {
        setMostraConferma(false);
    };
    
    const eliminaCategoria = (nomeDaRimuovere) => {

        setCategorie(categorie.filter((nome) => nome !== nomeDaRimuovere));

        // (opzionale) Rimuovi anche tutte le attività associate
        setAttivita(attivita.filter(att => att.categoria !== nomeDaRimuovere));

        // (opzionale) Resetta categoria attiva se è quella eliminata
        if (categoriaSelezionata === nomeDaRimuovere) {
            setCategoriaSelezionata('');
        }
    };

    //ATTIVITÀ  ------------------------------------------------------------------------------------------------------------------------------
    const [attivitaCompletate, setAttivitaCompletate] = useState({});
    
    //aggiungi nuova
    const aggiungiAttivita = (nome, categoria, data) => {
        nome = nome.toLowerCase();
        const esisteGia = attivita.some(a => a.nome === nome);

        if (esisteGia) {
            alert("Esiste già un'attività con questo nome!");
        } else {
            setAttivita([...attivita, { nome, categoria, data }]);
            setCategoriaSelezionata(categoria);
        }
    };
    
    //checked
    const toggleCompletato = (nomeAttivita) => {
        setAttivitaCompletate(prev => ({
            ...prev,
            [nomeAttivita]: !prev[nomeAttivita],
        }));
    };


    //modifica attività
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

    const confermaModificaAtt = () => {
        console.log("cambiaDataSelezionata: "+cambiaDataSelezionata)

        setAttivita(
            attivita.map((att) => {

                if(att.nome === nomeDaModificareAtt){
                    let nomeNuovo = null;
                    let dataNuova = null;
                
                    if(nuovoNomeAtt!==''){
                        nomeNuovo = nuovoNomeAtt;
                    }else{
                        nomeNuovo = nomeDaModificareAtt;
                    }

                    if(cambiaDataSelezionata!== undefined && cambiaDataSelezionata!== null && cambiaDataSelezionata!==''){
                        dataNuova = new Date(cambiaDataSelezionata);
                    }else{
                        dataNuova = att.data;
                    }
                    return { ...att, nome: nomeNuovo, data: dataNuova }
                }else{
                    return att;
                }
            })
        );
        
        setNomeDaModificareAtt("");
        setnuovoNomeAtt("");
        setCambiaDataSelezionata(null);
        setMostraModificaAtt(false);
    }

    //elimina  attività
    const eliminaAttivita = (nomeAttivita) => {
        setAttivita(prev => prev.filter(att => att.nome !== nomeAttivita));
        setAttivitaCompletate(prev => {
            const updated = { ...prev };
            delete updated[nomeAttivita];
            return updated;
        });
    };


    //Profilo ------------------------------------------------------------------------------------------------------------------------------
    const Profilo = () => {
        const att_num = attivita.length;
        const completateCount = attivitaCompletate ? Object.values(attivitaCompletate).filter(val => val).length : 0;
        navigate("/Profile", { state: {completateCount, att_num} });
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    return (
    <div className="Dashboard-class">
        <div className="header">
            <h1>Bentornato {username}, programmi per oggi?</h1>
            <div class="options">

                <Calendario
                    dataSelezionata={dataSelezionata}
                    setDataSelezionata={(data)=>setDataSelezionata(data)}
                    nuova={true}
                    highlightDates={dateEvidenziate}
                />
                <img className="profile" src={foto} alt="" onClick={Profilo}/>
            </div>
        </div>

        <div className="main">
            <div className="sezione-1">
                <ToDoTitle/>
                <Categorie
                    categorie={categorie}
                    onClickCategoria={(nome) => setCategoriaSelezionata(nome)}
                    onAggiungiCategoria={(x) => aggiungiCategoria(x)}
                    onRimuoviCategoria={(nome) => confermaEliminazione(nome)}
                    onModificaCategoria={(nome) => ModificaCategoria(nome)}
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
                            if(data === null || new Date(data).getTime() === new Date(a.data).getTime()){
                                if (!categoriaSelezionata || categoriaSelezionata.trim().toLowerCase() ==="tutte") return true;

                                const cat = categoriaSelezionata.trim().toLowerCase();

                                if (cat === "mancanti") {
                                    // Mostra solo attività non completate
                                    return !attivitaCompletate[a.nome];
                                }
                                
                                return (a.categoria || '').trim().toLowerCase() === cat;
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
                    attivitaCompletate={attivitaCompletate}
                    onToggleCompletato={toggleCompletato}
                    onEliminaAttivita={eliminaAttivita}
                    onModificaAttivita={(nome,data) => modificaAttivita(nome,data)}

                />
            </div>

            <div className="sezione-3">
                <Search onCerca={setTermineRicerca} />
                <Progressi 
                    attivita={attivita} 
                    attivitaCompletate={attivitaCompletate} 
                    onClickCategoria={(nome) => setCategoriaSelezionata(nome)} 
                />
            </div>
        </div>

        {/* MOSTRA CONFERMA  ------------------------------------------------------------------------------------------------------------------------------ */}

            {mostraConferma && (
                <div className="modale-conferma"
                style={{
                    width:'100vw',
                    height:'100vh',
                    position:'fixed',
                    top:'0',left:'0',
                    zIndex:'1',
                    backgroundColor:'rgba(0,0,0,0.5)'
                }}>
                    <div className="contenuto-modale" style={{
                            width: '400px',
                            margin: '10% auto',
                            backgroundColor: 'white',
                            padding: '20px 40px',
                            borderRadius: '1em',
                            display:'flex',
                            flexDirection:'column'
                    }}>
                        <h1 style={{marginBottom:'40px'}}>ATTENZIONE!</h1>
                        <p style={{marginBottom:'40px'}}>Rimuovendo questa categoria eliminerai anche le altre categorie e attività in essa contenute.</p>
                        <h3 style={{marginBottom:'20px'}}>Procedere comunque?</h3>
                        <div style={{
                            display:'flex',
                            justifyContent:'space-between'
                            }}>
                            <button onClick={annullaEliminazione} className='button-el' >Annulla</button>
                            <button onClick={procediConEliminazione} className='button-el' style={{
                            }}>Procedi</button>
                        </div>
                        
                    </div>
                </div>
            )}

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
                        <button className='button-mod' onClick={confermaModificaCategoria} disabled={!(nuovoNomeCategoria && nuovoNomeCategoria.trim() !== '')}>Conferma</button>
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
                        <button className='button-mod' onClick={confermaModificaAtt} disabled={!(nuovoNomeAtt && nuovoNomeAtt.trim() !== '')}>Conferma</button>
                    </div>
                </div>
            )}
    </div>
  );
}



export default Dashboard; 