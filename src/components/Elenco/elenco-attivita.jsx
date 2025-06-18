
import './elenco-attivita.css'
import Attivita from '../../components/Attivita/attivtia.jsx';
function Elenco_attivita ({attivita = [], categoriaAttiva, attivitaCompletate, onToggleCompletato, onEliminaAttivita, onModificaAttivita, categorie}) {

    return(
        <div className='elenco'>
            {attivita.length === 0 ? (
                <p>Ancora essuna attività</p>
            ) : (
                attivita.map((att) => (
                    <Attivita 
                        key={att.id}
                        nome={att.nome}
                        data={att.data}
                        categoria_id={att.categoria_id}
                        categoriaAttiva={categoriaAttiva}
                        checked={att.checked} // <-- lo stato della spunta
                        onToggle={() => onToggleCompletato(att)} // <-- aggiorna stato e database
                        onElimina={() => onEliminaAttivita(att, "attivita")}
                        modificaAttivita={() => onModificaAttivita(att.id, att.nome, att.data)}
                        categorie={categorie}
                    />
                ))
            )}
        </div>
    );
}
export default Elenco_attivita;