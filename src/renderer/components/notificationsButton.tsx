import * as React from 'react';
import { connect } from 'react-redux';
import { Notification } from '../store/reducers/notifications';
import { AppState } from '../store/store';
import { removeNotification, removeAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../actions/notifications';
import NotificationList from './notificationList';


interface OwnProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>
}
interface ReduxProps {
    unreadCount: number
}
type Props = OwnProps & ReduxProps;




class NotificationsButton extends React.PureComponent<Props, any>{
    getClassName = ()=>{
        const baseClass = 'notifications-button';
        if(this.props.unreadCount > 0){
            return `${baseClass} button-flat--secondary--accent`;
        }else{
            return `${baseClass} button-flat--secondary`;
        }
    }
    render() {
        return (
            <button
                onClick={this.props.onClick}
                className={this.getClassName()}
            >
                <i className='material-icons'>notifications</i>
            </button>
        )
    }
}

export default connect(
    (state:AppState,props:OwnProps) => {
        return{
            unreadCount: state.notifications.filter((notification)=>!notification.isRead).length
        }
    }
)(NotificationsButton);

