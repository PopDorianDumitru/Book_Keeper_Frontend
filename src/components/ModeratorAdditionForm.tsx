import { useEffect, useState } from "react";
import useAxiosStore from "../store/axiosStore";
import "../css/ModeratorAddingForm.css";
import useNotificationStore from "../store/notificationStore";
import { useNavigate } from "react-router-dom";
const ModeratorAdditionForm = () => {
    const [email, setEmail] = useState<string>('');
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const {setWarning, removeWarning, setSuccess, removeSuccess} = useNotificationStore(state=>state);
    useEffect(()=>{
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/admin`).then((response)=>{
            console.log(response.data);
        }).catch((error)=>{
            nav("/")
            setWarning({message: "You are not authorized to view this page."});
            setTimeout(()=>{
                removeWarning();
            }, 4000);
        });
    },[])
    const nav = useNavigate();
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    
    function addModerator(event: any): void {
        if(!/@/.test(email))
        {
            setWarning({message: "Email must contain @."});
            setTimeout(()=>{
                removeWarning();
            }, 4000);
            return;
        }
        getAxiosInstance().patch(`${process.env.REACT_APP_BASIC_URL}/moderator`, {email: email})
        .then((response)=>{
            console.log(response);
            setSuccess({message: "Moderator added successfully"});
            setTimeout(()=>{
                removeSuccess();
            }, 4000);
        })
        .catch((error)=>{
            console.log(error);
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
        <div className="form-template">
            <h2>Add a moderator</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
            />
            <button onClick={addModerator}>
                Add moderator
            </button>
        </div>
    );
}

export default ModeratorAdditionForm;