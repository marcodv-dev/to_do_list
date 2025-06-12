
import './categoria.css'

function Categoria ({nome, onElimina, onModifica, onClick}){
    return(
        <div className="categoria">
            <h2 onClick={onClick}>{nome}</h2>
            <div className='button-d'>
                <button onClick={onModifica}><img src="/modification_icon.png" alt="" /></button>
                <button onClick={onElimina}><img src="/trash_icon.png" alt="" /></button>
            </div>
        </div>
    );
}

export default Categoria;