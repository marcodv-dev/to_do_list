
import './elenco-attivita.css'
import Attivita from '../../components/Attivita/attivtia.jsx';

function Elenco_attivita ({attivita = [], categoriaAttiva, attivitaCompletate, onToggleCompletato, onEliminaAttivita, onModificaAttivita}) {

    return(
        <div className='elenco'>
            {attivita.length === 0 ? (
                <p>Ancora essuna attività</p>
            ) : (
                attivita.map((att) => (
                    <Attivita 
                        key={att.nome}
                        nome={att.nome}
                        data={att.data}
                        categoria={att.categoria}
                        categoriaAttiva={categoriaAttiva}
                        checked={!!attivitaCompletate[att.nome]}
                        onToggle={() => onToggleCompletato(att.nome)}
                        onElimina={(nome) => onEliminaAttivita(nome)}
                        modificaAttivita={() => onModificaAttivita(att.nome)}
                    />
                ))
            )}
        </div>
    );
}

export default Elenco_attivita;