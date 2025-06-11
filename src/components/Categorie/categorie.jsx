
import './categorie.css'
import Categoria from '../../components/Categoria/categoria.jsx'

function Categorie ({ categorie, onClickCategoria, onAggiungiCategoria, onRimuoviCategoria, onModificaCategoria }) {

    const aggiungiCategoria = () => {

        const nomeInserito = prompt('Inserisci il nome della nuova categoria:');

        if (nomeInserito && nomeInserito.trim() !== '') { // se ha inserito qualcosa

            const nomePulito = nomeInserito.trim();

            if (!categorie.includes(nomePulito)) { // se non esiste un'altra con lo stesso nome
                onAggiungiCategoria(nomePulito);
            } else {
                alert('Questa categoria esiste già!');
            }
        }
    };



    return(
        <div className="categorie">
            <input className="new-b" type="button" value="Nuova categoria" onClick={aggiungiCategoria}/>
            <div className="esistenti">

                <div className="tutte" onClick={() => onClickCategoria(null)}>
                    <h2>Tutte le categorie</h2>
                </div>

                {categorie.map((nome) => (
                    <div key={nome} onClick={() => onClickCategoria(nome)}>
                        <Categoria 
                        nome={nome} 
                        onElimina={() => onRimuoviCategoria(nome)}
                        onModifica={() => onModificaCategoria(nome)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Categorie;