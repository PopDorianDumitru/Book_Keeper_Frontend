import useUserStore from "../store/userStore";
import "../css/ProfileOverview.css";   
import {User} from "../interfaces/UserInterface";
import { useEffect, useState } from "react";
import useAxiosStore from "../store/axiosStore";
import useNotificationStore from "../store/notificationStore";
const ProfileOverview = () => {
    const {getUser} = useUserStore(state=>state);
    const [user, setUser] = useState<User | null>(null);
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const {setWarning, removeWarning, setSuccess, removeSuccess} = useNotificationStore(state=>state);
    useEffect(()=>{
        getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/users/profile`, {email: getUser()?.email})
        .then((response)=>{
            setUser(response.data);
            console.log(response.data)
        })
        .catch((err:any)=>{
            if(err.code !== "ERR_NETWORK" &&err.response.status === 401)
                return;
            setUser(null);
        });
    },[]);
    function sendVerificationEmail(event: any): void {
        event.preventDefault();
        getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/verificationEmail`, {email: getUser()?.email})
        .then((response)=>{
            console.log(response);
            setSuccess({message: "Verification email sent successfully"});
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
        <div className="profile-container">
            <h2>Profile</h2>
            {
                user !== null &&
                <div className="profile-details">
                    <p>Username: {user?.username}</p>
                    <p>Email: {user?.email}</p>
                    <p>Verified: {user?.verified ? "yes" : "no"}</p>
                    {user?.verified ? <></> : <button onClick={sendVerificationEmail}>Send verification email</button>}
                </div>
            }
            {
                user === null &&
                <p>Log in to view your profile</p>
            }
        </div>
    );
}


export default ProfileOverview;
