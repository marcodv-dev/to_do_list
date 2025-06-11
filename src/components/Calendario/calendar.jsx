
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './calendar.css'

function Calendario({dataSelezionata, setDataSelezionata, nuova, highlightDates}) {
  const [mostraCalendario, setMostraCalendario] = useState(false);
  return (
    <div className='calendar'>

      <div className='selezionate'>

        {dataSelezionata && nuova && (
          <button className='button-c' onClick={(data) => {setDataSelezionata(null)}}>Tutte le date</button>
        )}

        {dataSelezionata && (
          <h2>{dataSelezionata.toLocaleDateString()}</h2>
        )}
      </div>

      <button className="calendario-b" onClick={() => setMostraCalendario(!mostraCalendario)}>
        <img className="calendar" src="./calendar_icon.png" alt="" />
      </button>

      {mostraCalendario && (
        <div className='picker'>
          <DatePicker
            selected={dataSelezionata? dataSelezionata : null}
            onChange={(data) => {setDataSelezionata(data); setMostraCalendario(false);}}
            inline // mostra il calendario direttamente
            highlightDates={[
              {"giorno-evidenziato": highlightDates}
            ]}
            
          />
        </div>
      )}

    </div>
  );
}

export default Calendario;
