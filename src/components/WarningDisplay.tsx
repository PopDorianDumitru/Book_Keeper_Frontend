import '../css/Notification.css'
import useNotificationStore from '../store/notificationStore';
const WarningDisplay = () => {
    const {visibleWarning, warning} = useNotificationStore(state=>state);
    return (
        <div>
            {   
                visibleWarning &&
                <div className="warning">
                    <p>{warning.message}</p>
                </div>
            }
        </div>
    );
}

export default WarningDisplay;