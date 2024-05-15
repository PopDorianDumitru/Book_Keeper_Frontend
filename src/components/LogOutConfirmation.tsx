import useUserStore from "../store/userStore";
import "../css/LogOutForm.css";
import useAxiosStore from "../store/axiosStore";
import useNotificationStore from "../store/notificationStore";
import { useNavigate } from "react-router-dom";
const LogOutConfirmation = () => {
    const {hideLogOutForm, setIsConnected, removeUser, setAccessToken, getAccessToken} = useUserStore(state=>state);
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const {setWarning, removeWarning, setSuccess, removeSuccess} = useNotificationStore(state=>state);
    const nav = useNavigate();
    const logOut = () => {
        getAxiosInstance().delete(`${process.env.REACT_APP_BASIC_URL}/logout`, {headers: {Authorization: `Bearer ${getAccessToken()}`}})
        .then(()=>{
            removeUser();
            setIsConnected(false);
            hideLogOutForm();
            setAccessToken("");
            setSuccess({message: "User logged out successfully"});
            setTimeout(()=>{
                removeSuccess();
            }, 4000);
            nav("/");
        })
        .catch((error)=>{
            if(error.code !== "ERR_NETWORK" &&error.response.status === 401)
                return;
            if(error.code === "ERR_NETWORK")
            {
                setWarning({message: "Network error. Please try again later."});
                setTimeout(()=>{
                    removeWarning();
                }, 4000);
                return;
            }
            setWarning({message: error.response.data});
            setTimeout(()=>{
                removeWarning();
            }, 4000);
        });
    }
    return (
        <div className="logout-container">
            <div className="logout-box">
                <h2>Are you sure you want to log out?</h2>
                <div className="button-container">
                    <button onClick={logOut}>Yes</button>
                    <button onClick={()=>hideLogOutForm()}>No</button>
                </div>
            </div>
        </div>
    );
}

export default LogOutConfirmation