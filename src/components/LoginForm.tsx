import InputTemplate from "./inputTemplate";
import "../css/LoginForm.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../store/notificationStore";
import useAxiosStore from "../store/axiosStore";
import useUserStore from "../store/userStore";
const LogInForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const nav = useNavigate();
    const {setWarning, removeWarning} = useNotificationStore(state=>state);
    const {setSuccess, removeSuccess} = useNotificationStore(state=>state);
    const {setIsConnected, setUser, setAccessToken} = useUserStore(state=>state);
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const [secondFactor, setSecondFactor] = useState(false);

    const logInBeforeCode = async () =>{
        getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/login`, {email, password})
                .then(  (response) =>{
                    console.log(response);
                    setSuccess({message: "Second factor authentication required. A code has been sent to your email."});
                    setTimeout(()=>{
                        removeSuccess();
                    }, 4000);
                    setSecondFactor(true);
                })
                .catch((error)=>{
                    if(error.response.status === 401)
                        return;
                    if(error.response.status === 403)
                    {
                        console.log(error)
                        setWarning({message: error.response.data.message});
                        setTimeout(()=>{
                            removeWarning();
                        }, 4000);
                        return;
                    }
                    setWarning({message: error.response.data.message});
                    setTimeout(()=>{
                        removeWarning();
                    }, 4000);
                })
    }

    const logInWithCode = async () =>{
        getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/login`, {email, password, code})
        .then(  (response) =>{
                console.log(response);
                setSuccess({message: "User logged in successfully"});
                setTimeout(()=>{
                    removeSuccess();
                }, 4000);
                nav("/");
                setIsConnected(true);

                setUser(response.data.user);
                setAccessToken(response.data.token);
            })
        .catch((error)=>{
            if(error.response.status === 401)
                return;
            if(error.response.status === 403)
            {
                console.log(error)
                setWarning({message: error.response.data.message});
                setTimeout(()=>{
                    removeWarning();
                }, 4000);
                return;
            }
            setWarning({message: error.response.data.message});
            setTimeout(()=>{
                removeWarning();
            }, 4000);
        })
    }


    const loginUser = async (event: React.FormEvent) => {
        event.preventDefault();
        try{
            if(email.length < 2)
                throw new Error("Email must be at least 2 characters long");
            if(code.length !== 0)
            {
                await logInWithCode();
            }
            else
            {
                await logInBeforeCode();
            }
            
        }
        catch(e:any){
            setWarning({message: e.message});
            setTimeout(()=>{
                removeWarning();
            }, 4000);
        }
    }
    const resendCode = async(event: React.FormEvent)=>{
        event.preventDefault();
        await logInBeforeCode();
    }

    return (
        <form className="login-form" onSubmit={loginUser}>
            <InputTemplate id="email" label="Email" type="text" placeHolderText="Enter email" change={(value:string)=>{setEmail(value)}} />
            <InputTemplate id="password" label="Password" type="password" placeHolderText="Enter password" change={(value:string)=>{setPassword(value)}} />
            {secondFactor && <InputTemplate id="code" label="Code" type="text" placeHolderText="Enter code" change={(value:string)=>{setCode(value)}} />}
            {secondFactor && <button onClick={resendCode}>Resend code</button>}
            <button type="submit">Log In</button>
        </form>
    )
};

export default LogInForm;