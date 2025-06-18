
import './attivita.css'

function Activity ({ nome, categoria_id, data, categoriaAttiva, checked, onToggle, onElimina, modificaAttivita, categorie }) {

    const nomeCategoria = categorie.find(cat => cat.id === categoria_id)?.nome || '';
    
    return (
        <div className="activity">
            <div className="categoria-activity">
                <h3>{!categoriaAttiva || categoriaAttiva === 'mancanti'? nomeCategoria : '' }</h3>
                <label htmlFor="data">{(new Date(data).toLocaleDateString('it-IT', { day: '2-digit', month: 'numeric', year: 'numeric' }))}</label>
            </div>
            <div className="main-activity">
                <div className="sinistra">
                    <input 
                        type="checkbox"
                        className="check"
                        checked={checked}
                        onChange={onToggle}
                    />
                    <h2 className={checked ? 'barrato' : ''} onClick={onToggle}>{nome}</h2>
                </div>
                <div className="destra">
                    <button className="modifica" 
                        onClick={modificaAttivita}
                        disabled={checked}
                        style={{ opacity: checked ? 0.4 : 1, pointerEvents: checked ? 'none' : 'auto' }}
                    ><img src="/modification_icon.png" alt="" /></button>
                    <button className="elimina" onClick={() => onElimina()}><img src="/trash_icon.png" alt="" /></button>
                </div>
            </div>
        </div>
    );
}

export default Activity;