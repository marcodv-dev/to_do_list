
import './attivita.css'

function Activity ({ nome, categoria, data, categoriaAttiva, checked, onToggle, onElimina, modificaAttivita }) {

    return (
        <div className="activity">
            <div className="categoria-activity">
                <h3>{categoria !== categoriaAttiva? categoria : ''}</h3>
                <label htmlFor="data">{data.toLocaleDateString()}</label>
            </div>
            <div className="main-activity">
                <div className="sinistra">
                    {/* <input type="checkbox" name=""  id="mycheckbox" /> */}
                    {/* <div class="check"><img src="/trash_icon.png" alt="" /></div> */}
                    <input 
                        type="checkbox"
                        className="check"
                        checked={checked} 
                        onClick={onToggle}
                        readOnly
                    />
                    <h2 className={checked ? 'barrato' : ''} onClick={onToggle}>{nome}</h2>
                </div>
                <div className="destra">
                    <button className="modifica" 
                        onClick={modificaAttivita}
                        disabled={checked}
                        style={{ opacity: checked ? 0.4 : 1, pointerEvents: checked ? 'none' : 'auto' }}
                    ><img src="/modification_icon.png" alt="" /></button>
                    <button className="elimina" onClick={onElimina}><img src="/trash_icon.png" alt="" /></button>
                </div>
            </div>
        </div>
    );
}

export default Activity;