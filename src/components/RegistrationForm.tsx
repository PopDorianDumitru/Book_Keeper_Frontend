import InputTemplate from "./inputTemplate";
import "../css/RegistrationForm.css"
import { useState } from "react";
import useAxiosStore from "../store/axiosStore";
import useNotificationStore from "../store/notificationStore";
import { useNavigate } from "react-router-dom";
const RegistrationForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const {setWarning, removeWarning} = useNotificationStore(state=>state);
    const {setSuccess, removeSuccess} = useNotificationStore(state=>state);   
    const registerUser = (event: React.FormEvent) => {
        event.preventDefault();
        try{
                if(username.length < 2)
                throw new Error("Username must be at least 2 characters long");
            
                if(password.length < 8)
                throw new Error("Password must be at least 8 characters long");
            
                if(email.length < 2)
                throw new Error("Email must be at least 2 characters long");
            
            
                if(!/[A-Z]/.test(password))
                    throw new Error("Password must contain at least one capital letter");
            
                if(!/[a-z]/.test(password))
                    throw new Error("Password must contain at least one lowercase letter");
            
                if(!/[!@#$%^&*,.?:|]/.test(password))
                    throw new Error("Password must contain at least one special character");
                if(!/[0-9]/.test(password))
                    throw new Error("Password must contain at least one number");
                if(!/@/.test(email))
                    throw new Error("Email must contain @");
                getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/users`, {username, password, email})
                .then((response)=>{
                    setSuccess({message: "User registered successfully. The next step is logging in!"});
                    setTimeout(()=>{
                        removeSuccess();
                    }, 4000);
                    nav("/login");

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
                })
                
        }
        catch(e:any){
            setWarning({message: e.message});
            setTimeout(()=>{
                removeWarning();
            }, 4000);
        }
    }

    return(
        <form className="registration-form" onSubmit={registerUser}>
            <InputTemplate id="username" label="Username" type="text" placeHolderText="Enter username" change={(value:string)=>{setUsername(value)}} />
            <InputTemplate id="password" label="Password" type="password" placeHolderText="Enter password" change={(value:string)=>{setPassword(value)}} />
            <InputTemplate id="email" label="Email" type="email" placeHolderText="Enter email" change={(value:string)=>{setEmail(value)}} />
            <button type="submit">Register</button>
        </form>
    )
};

export default RegistrationForm;