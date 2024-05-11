import '../css/Notification.css'
import useNotificationStore from '../store/notificationStore';
const NotificationDisplay = () => {
    const {visible, notification} = useNotificationStore(state=>state);
    return (
        <div>
            {   visible &&
                <div className="notification">
                    <p>{notification.user}: </p>
                    <p>{notification.message}</p>
                </div>
            }
        </div>
    );
}

export default NotificationDisplay;