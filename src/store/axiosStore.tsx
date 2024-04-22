
import axios, { AxiosInstance } from 'axios';
import { create } from 'zustand';
import useNotificationStore from './notificationStore';
import useBookStore from './bookStore';
import useBookReviewStore from './bookReviewStore';
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
            });
            instance.interceptors.request.use((config) => {
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
            }, (error) => {
                console.log(error);
                if(error.code === "ERR_NETWORK")
                {
                    get().setBackendDown(true);
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
                        const interval = setInterval(() => {
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
