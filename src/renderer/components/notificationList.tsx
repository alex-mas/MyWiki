import * as React from 'react';
import { connect } from 'react-redux';
import { Notification } from '../store/reducers/notifications';
import { AppState } from '../store/store';
import { removeNotification, removeAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../actions/notifications';

interface ReduxProps {
    notifications: Notification[]
}

interface DispatchProps {
    removeNotification: typeof removeNotification
    removeAllNotifications: typeof removeAllNotifications,
    markNotificationAsRead: typeof markNotificationAsRead,
    markAllNotificationsAsRead: typeof markAllNotificationsAsRead
}
interface OwnProps {
    isActive: boolean,
}
type Props = DispatchProps & ReduxProps & OwnProps;

interface NotificationProps {
    notification: Notification
    onRemove: (id: string) => any,
}


class NotificationComponent extends React.PureComponent<NotificationProps, any>{
    onRemove = () => {
        this.props.onRemove(this.props.notification.id);
    }
    render() {
        const { notification } = this.props;
        return (
            <li className='notification'>
                <div key='icon' className='notification__icon'>
                    <i className='material-icons'>
                        {notification.icon}
                    </i>
                </div>
                <div key='contents' className='notification__contents'>
                    <div className='notification__title'>
                        {notification.title}
                    </div>
                    <div className='notification__description'>
                        {notification.description}
                    </div>
                </div>
                <div key='actions' className='notification__actions'>
                    <button
                        className='notification__action'
                        onClick={this.onRemove}
                    >
                        <i className='material-icons'>
                            check
                        </i>
                    </button>
                </div>
            </li>
        )
    }
}

class NotificationList extends React.PureComponent<Props, any>{
    render() {
        if (!this.props.isActive || this.props.notifications.length === 0) {
            return null;
        }
        return (
            <ul className='notification-list'>
                {this.props.notifications.map((notification) => (
                    <NotificationComponent
                        key={notification.id}
                        notification={notification}
                        onRemove={this.props.removeNotification}
                    />
                ))}
            </ul>
        );
    }
}


export default connect(
    (state: AppState, props) => {
        return {
            notifications: state.notifications
        }
    },
    {
        removeNotification,
        removeAllNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead
    }
)(NotificationList)