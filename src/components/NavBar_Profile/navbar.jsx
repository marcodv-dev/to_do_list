
import "./navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar () {

    const navigate = useNavigate();

    //INDIETRO DASHBOARD
    const indietro = () => {
        navigate("/Dashboard");
    }

    return(
        <div className="navbar">
            <h1>Profilo</h1>
            <button className="indietro" onClick={indietro}>
                <img src="/x_icon.png" alt="" />
            </button>
        </div>
    );
}
export default Navbar;