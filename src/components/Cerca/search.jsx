
import './search.css'

function cerca ({ onCerca }) {
    return(
        <div className='search'>
            <div className="search-div">
                <img src="/search_icon.png" alt="" />
                <input type="text" placeholder='Cerca' onChange={(e) => onCerca(e.target.value)}/>
            </div>
        </div>
    );
}

export default cerca;