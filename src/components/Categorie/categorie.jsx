
import './categorie.css'
import Categoria from '../../components/Categoria/categoria.jsx'
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

function Categorie ({ categorie, onClickCategoria, onAggiungiCategoria, onRimuoviCategoria, onModificaCategoria, avviso }) {

    //MOSTRO LE CATEGORIE
    const [mostraTutte, setMostraTutte] = useState (false);
    useEffect(() => {
        if (categorie.length === 0) setMostraTutte(false);
        else setMostraTutte(true);
    }, [categorie.length]);

    //AGGIUNGO CATEGORIA
    const aggiungiCategoria = () => {
        Swal.fire({
            title: 'Nuova categoria',
            text: "Inserisci il nome della nuova categoria:",
            input: 'text',
            inputPlaceholder: 'Categoria',
            showCancelButton: true,
            confirmButtonColor: '#246779',
            cancelButtonColor: '#246779',
            confirmButtonText: 'Aggiungi',
            cancelButtonText: 'Annulla',
            inputValidator: (value) => {
                if (!value) return 'Devi scrivere qualcosa!';
                return null;
            }
        }).then((result) => {
            const nomeInserito = result.value;
            if (nomeInserito && nomeInserito.trim() !== '') {                               // se ha inserito qualcosa
                const nomePulito = nomeInserito.trim();
                if (!categorie.includes(nomePulito)) onAggiungiCategoria(nomePulito);       // se non esiste un'altra con lo stesso nome
                else avviso('Questa categoria esiste già!');
            }
        });
    };

    return(
        <div className="categorie">
            <input className="new-b" type="button" value="Nuova categoria" onClick={aggiungiCategoria}/>
            <div className="esistenti">
                {mostraTutte && (
                    <div className="tutte" onClick={() => onClickCategoria(null)}>
                        <h2>Tutte le categorie</h2>
                    </div>
                )}
                {categorie.map((categoria) => (
                    <div key={categoria.id}>
                        <Categoria 
                        nome={categoria.nome} 
                        onElimina={() => onRimuoviCategoria(categoria,"categoria")}
                        onModifica={() => onModificaCategoria(categoria.nome)}
                        onClick={() => onClickCategoria(categoria)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Categorie;