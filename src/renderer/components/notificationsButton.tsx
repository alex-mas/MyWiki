import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../store/store';
import { Notification } from '../store/reducers/notifications';



interface OwnProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>
}
interface ReduxProps {
    notifications: Notification[]
}
type Props = OwnProps & ReduxProps;




class NotificationsButton extends React.PureComponent<Props, any>{
    getClassName = ()=>{
        const baseClass = 'notifications-button';
        if(this.getUnreadCount() > 0){
            return `${baseClass} button-flat--primary--accent`;
        }else{
            return `${baseClass} button-flat--secondary`;
        }
    }
    getUnreadCount = ()=>{
        return this.props.notifications.filter((notification)=>!notification.isRead).length
    }
    render() {
        return (
            <button
                onClick={this.props.onClick}
                className={this.getClassName()}
            >
                <i className='material-icons'>notifications</i>
                <span className="notifications-button__number">{this.getUnreadCount()}</span>
            </button>
        )
    }
}

export default connect(
    (state:AppState,props:OwnProps) => {
        return{
            notifications: state.notifications
        }
    }
)(NotificationsButton);

