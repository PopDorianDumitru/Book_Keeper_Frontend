import { useEffect, useState } from "react";
import useAxiosStore from "../store/axiosStore";
import useUserStore from "../store/userStore";
import { useLocation, useNavigate } from "react-router-dom";
import useNotificationStore from "../store/notificationStore";
const VerifyingPage = () => {
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const {getUser} = useUserStore(state=>state);
    const {setSuccess, removeSuccess, setWarning, removeWarning} = useNotificationStore(state=>state);
    const location = useLocation();
    const nav = useNavigate();
    const [verified, setVerified] = useState<Boolean | null>(null);

    useEffect(()=>{
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/verify?token=${token}`, {email: getUser()?.email})
        .then(()=>{
            setSuccess({message: "User verified successfully"});
            setVerified(true);
            setTimeout(()=>{
                removeSuccess();
            }, 4000);
            setTimeout(()=>{
                nav("/login");
            }, 4000);
        })
        .catch((error)=>{
            setVerified(false);
            if(error.code !== "ERR_NETWORK" &&error.response.status === 401)
                return;
            if(error.code !== "ERR_NETWORK" &&error.response.status === 404)
            {
                setWarning({message: error.response.data.message});
                setTimeout(()=>{
                    removeWarning();
                    nav("/registration")
                }, 4000);
                return;
            }
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
                nav("/")

            }, 4000);
        })
    }, []);
    return (
        <div className="verifying-container">
        <h2>Verifying...</h2>
        {
            verified !== null &&
            <div>
                <p>{verified ? "Done! Success!" : "Sorry! There seemed to be a problem"}</p>
            </div>
        }
        </div>
    );
}

export default VerifyingPage;
