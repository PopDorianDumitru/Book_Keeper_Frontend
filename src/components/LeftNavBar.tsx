import { Link } from "react-router-dom";
import "../css/LeftNavBar.css";
import useUserStore from "../store/userStore";
const LeftNavBar = () => {
    const {getConnection, showLogOutForm, getRole} = useUserStore(state=>state);
    
    const logOut = () => {
        showLogOutForm();
    }

    return (
        <div className="nav-bar">
            {getConnection() && <Link to="/profile"><button>Profile</button></Link>}
            <Link to="/"><button>Books</button></Link>
            {!getConnection() && <Link to="/registration"><button>Register</button></Link>}
            {!getConnection() && <Link to="/login"><button>Log In</button></Link>}
            {getConnection() && <div className="nav-bar-component"><button onClick={logOut}>Log out</button></div>}
            {getConnection() && getRole() == "admin" && <Link to="/moderator_registration"><button>Add Moderator</button></Link>}
        </div>
    )
}

export default LeftNavBar;