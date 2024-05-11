
import axios, { AxiosInstance } from 'axios';
import { create } from 'zustand';
import useUserStore from './userStore'
import useNotificationStore from './notificationStore';
import useBookReviewStore from './bookReviewStore';
import useBookStore from './bookStore';
interface AxiosState {
    axiosConnection: AxiosInstance; 
    getAxiosInstance: ()=>AxiosInstance;
    backendDown: boolean;  
    setBackendDown: (value: boolean)=>void;
    startPinging: ()=>void;
}

const useAxiosStore = create<AxiosState>()(
        (set, get) => {
            const instance = axios.create({
                baseURL: process.env.REACT_APP_BASIC_URL,
                withCredentials: true,
            });
            instance.interceptors.request.use((config) => {
                const {getAccessToken} = useUserStore.getState();
                config.headers.Authorization = `Bearer ${getAccessToken()}`;
                return config;
            }, (error) => {
                if(error.code === "ERR_NETWORK")
                {
                    get().setBackendDown(true);
                }
                return Promise.reject(error);
            });
            instance.interceptors.response.use((response) => {
                if(get().backendDown)
                {
                    get().setBackendDown(false);
                }
                return response
            }, async (error) => {
                console.log(error);
                if(error.code === "ERR_NETWORK")
                {
                    get().setBackendDown(true);
                }
                else
                if(error.response.status === 401)
                {
                    try{
                        const response = await get().getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/refresh`);
                        const {setAccessToken} = useUserStore.getState();
                        setAccessToken(response.data.accessToken);
                        const config = error.config;
                        console.log("Refreshed token")
                        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                        return get().getAxiosInstance()(config);
                    }
                    catch(err:any){
                        console.log("Token refresh failed: " + err);
                        const {setWarning, removeWarning} = useNotificationStore.getState();
                        setWarning({message: "Please log in to use this feature."});
                        setTimeout(()=>{
                            removeWarning();
                        }, 4000);
                        const {removeUser, setAccessToken, setIsConnected } = useUserStore.getState();
                        removeUser();
                        setAccessToken("");
                        setIsConnected(false);
                    }
                }
                return Promise.reject(error);
            
            });
           return(
                {
                    axiosConnection: instance,
                    backendDown: false,
                    setBackendDown: (value)=>{
                        if(value && !get().backendDown)
                        {
                            get().startPinging();
                        }
                        else
                        if(!value)
                        {
                            const {setNotification, removeNotification} = useNotificationStore.getState();
                            const {saveDirtyBooks} = useBookStore.getState();
                            const {saveDirtyBookReviews} = useBookReviewStore.getState();
                            saveDirtyBooks();
                            saveDirtyBookReviews();
                            setNotification({user: "System", message: "Server is back online"});
                            setTimeout(()=>{
                                removeNotification();
                            }, 3000);

                        }
                        set({backendDown: value})
                    },
                    startPinging: ()=>{
                        const {setNotification, removeNotification} = useNotificationStore.getState();
                        setNotification({user: "System", message: "Server is offline"});
                        setTimeout(()=>{
                            removeNotification();
                        }, 3000);
                        const interval = setInterval(()=> {
                            instance.get("/")
                            .then((response)=>{
                                console.log("Ping response: " + response.data);
                                set({backendDown: false});
                                clearInterval(interval);
                            })
                            .catch((error)=>{

                                console.log("Ping error: " + error);
                            })
                        }, 3000);
                    },
                    getAxiosInstance: () => get().axiosConnection
                }    
            )
        },
);

export default useAxiosStore;
