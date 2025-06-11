
import './progress.css'
import React from "react";

function progressi ({attivita = [], attivitaCompletate = {}, onClickCategoria}) {
  
    const totalBlocks = 100;

    const totale = attivita.length;

    const completate = attivita.filter(att => attivitaCompletate[att.nome]).length;

    //calcolo percentuale e blocchi colorati
    const percentage = totale === 0 ? 0 : Math.round((completate / totale) * 100);
    const filledBlocks = Math.min(Math.max(percentage, 0), 100);

    return(
        <div className='progress'>
            <input type="button" value="Mancanti"  onClick={() => onClickCategoria("mancanti")}/>
            <div className="avanzamento-progressi">
                <h2>Progressi</h2>
                    
                <div className="percent-container">
                    <div className="percentuale">{filledBlocks}%</div>
                    <div className="percentuale-blocchi">
                        {[...Array(totalBlocks)].map((_, index) => (
                        <div
                            key={index}
                            className={`block ${index < filledBlocks ? "filled" : ""}`}
                        ></div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default progressi;