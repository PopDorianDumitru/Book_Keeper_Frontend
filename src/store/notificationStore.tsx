import { create } from "zustand";


interface NotificationState{
    notification: {
        user: string,
        message: string,
    };
    visible: boolean;
    warning: {
        message: string,
    }
    visibleWarning: boolean;
    setWarning: (warning: {message: string})=>void;
    removeWarning: ()=>void;
    setNotification: (notification: {user:string, message: string})=>void;
    removeNotification: ()=>void;

    success:{
        message: string,
    }
    visibleSuccess: boolean;
    setSuccess: (success: {message: string})=>void;
    removeSuccess: ()=>void;

}

const useNotificationStore = create<NotificationState>()(
    (set,get)=>({
        notification: {
            user: "",
            message: "",
        },
        visible: false,
        setNotification: (notification)=> set({notification: notification, visible: true}),
        removeNotification: ()=> set({visible: false}),
        warning: {
            message: "",
        },
        visibleWarning: false,
        setWarning: (warning)=> {set({warning: warning, visibleWarning: true})},
        removeWarning: ()=> set({visibleWarning: false}),

        success:{
            message: "",
        },
        visibleSuccess: false,
        setSuccess: (success)=> set({success: success, visibleSuccess: true}),
        removeSuccess: ()=> set({visibleSuccess: false}),
    })
)
export default useNotificationStore;
