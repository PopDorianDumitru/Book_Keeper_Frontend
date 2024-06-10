import { User } from "../interfaces/UserInterface";
import {create} from 'zustand'
import {persist,  createJSONStorage} from 'zustand/middleware'

interface UserState{
    user: Partial<User> | null;
    setUser: (user: Partial<User>)=>void;
    getUser: ()=>Partial<User> | null;
    removeUser: ()=>void;
    isConnected: boolean;
    accessToken: string;
    getAccessToken: ()=>string;
    setAccessToken: (token: string)=>void;
    toggleConnection: ()=>void;
    getConnection: ()=>boolean;
    visibleLogOutForm: boolean;
    showLogOutForm: ()=>void;
    hideLogOutForm: ()=>void;
    setIsConnected: (value: boolean)=>void;
    getRole: ()=>string | undefined;

}

const useUserStore = create<UserState>()(
    persist(
        (set,get)=>({
            user: null,
            getUser: ()=> get().user,
            setUser: (user)=> set({user: user}),
            removeUser: ()=> set({user: null}),
            isConnected: false,
            accessToken: "",
            getAccessToken: ()=> get().accessToken,
            setAccessToken: (token: string)=> set({accessToken: token}),
            toggleConnection: ()=> set({isConnected: !get().isConnected}),
            getConnection: ()=> get().isConnected,
            visibleLogOutForm: false,
            showLogOutForm: ()=> set({visibleLogOutForm: true}),
            hideLogOutForm: ()=> set({visibleLogOutForm: false}),
            setIsConnected: (value: boolean)=> set({isConnected: value}),
            getRole: ()=> get().user?.role,
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(()=>localStorage),
        }
    )
)

export default useUserStore;