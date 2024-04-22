import { create } from "zustand";


interface NotificationState{
    notification: {
        user: string,
        message: string,
    };
    visible: boolean;
    setNotification: (notification: {user:string, message: string})=>void;
    removeNotification: ()=>void;
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
    })
)
export default useNotificationStore;
