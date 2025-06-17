
import './elenco-attivita.css'
import Attivita from '../../components/Attivita/attivtia.jsx';
import { useEffect } from 'react';

function Elenco_attivita ({attivita = [], categoriaAttiva, attivitaCompletate, onToggleCompletato, onEliminaAttivita, onModificaAttivita, categorie}) {

    
    return(
        <div className='elenco'>
            {attivita.length === 0 ? (
                <p>Ancora essuna attività</p>
            ) : (
                attivita.map((att) => (
                    // console.log(att.categoria_id),
                    <Attivita 
                        key={att.id}
                        nome={att.nome}
                        data={new Date(att.data)}
                        categoria_id={att.categoria_id}
                        categoriaAttiva={categoriaAttiva}
                        checked={att.checked} // <-- lo stato della spunta
                        onToggle={() => onToggleCompletato(att)} // <-- aggiorna stato e database
                        onElimina={() => onEliminaAttivita(att, "attivita")}
                        modificaAttivita={() => onModificaAttivita(att.nome)}
                        categorie={categorie}
                    />
                ))
            )}
        </div>
    );
}

export default Elenco_attivita;