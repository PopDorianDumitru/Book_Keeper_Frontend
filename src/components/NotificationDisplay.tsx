import '../css/Notification.css'
import useNotificationStore from '../store/notificationStore';
function NotificationDisplay() {
    const {notification} = useNotificationStore(state=>state);
    return (
        <div className="notification">
            <p>{notification.user} left a review:</p>
            <p>{notification.review}</p>
        </div>
    );
}

export default NotificationDisplay;