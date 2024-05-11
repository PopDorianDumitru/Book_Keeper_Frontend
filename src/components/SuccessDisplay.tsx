import '../css/Notification.css'
import useNotificationStore from '../store/notificationStore';
const SuccessDisplay = () => {
    const {visibleSuccess, success} = useNotificationStore(state=>state);
    return (
        <div>
            {   
                visibleSuccess &&
                <div className="success">
                    <p>{success.message}</p>
                </div>
            }
        </div>
    );
}

export default SuccessDisplay;