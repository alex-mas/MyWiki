import * as React from 'react';
import { connect } from 'react-redux';
import { Notification } from '../store/reducers/notifications';
import { AppState } from '../store/store';
import { removeNotification, removeAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../actions/notifications';
import NotificationComponent from './notification';

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