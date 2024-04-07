import { create } from "zustand";


interface NotificationState{
    notification: {
        user: string,
        review: string,
    };
    visible: boolean;
    setNotification: (notification: {user:string, review: string})=>void;
    removeNotification: ()=>void;
}

const useNotificationStore = create<NotificationState>()(
    (set,get)=>({
        notification: {
            user: "",
            review: "",
        },
        visible: false,
        setNotification: (notification)=> set({notification: notification, visible: true}),
        removeNotification: ()=> set({visible: false}),
    })
)
export default useNotificationStore;
