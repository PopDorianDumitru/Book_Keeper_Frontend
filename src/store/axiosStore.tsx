
import axios, { AxiosInstance } from 'axios';
import { create } from 'zustand';

interface AxiosState {
    axiosConnection: AxiosInstance; 
    getAxiosInstance: ()=>AxiosInstance   
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
                    console.log("Network error. The server is not responding. Please try again later");
                    window.alert("Network error. The server is not responding. Please try again later");
                }
                return Promise.reject(error);
            });
            instance.interceptors.response.use((response) => {
                return response
            }, (error) => {
                if(error.code === "ERR_NETWORK")
                {
                    console.log("Network error. The server is not responding. Please try again later");
                    window.alert("Network error. The server is not responding. Please try again later");
                }
                return Promise.reject(error);
            
            });
           return(
                {
                    axiosConnection: instance,
            
                    getAxiosInstance: () => get().axiosConnection
                }    
            )
        },
);

export default useAxiosStore;
