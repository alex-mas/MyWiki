import * as React from 'react';
import { connect } from 'react-redux';
import { Notification } from '../store/reducers/notifications';
import { AppState } from '../store/store';
import { removeNotification, removeAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../actions/notifications';
import NotificationComponent from './notification';
import {useRef, useCallback} from 'react';
import { useOnClickOutside } from '../hooks/useClickOutside';

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
    onClose: ()=>void
}
type Props = DispatchProps & ReduxProps & OwnProps;


export const NotificationList = (props: Props)=>{
    const listRoot = useRef(null);
    useOnClickOutside(listRoot,props.onClose);
    if (!props.isActive || props.notifications.length === 0) {
        return null;
    }
    return (
        <ul className='notification-list' ref={listRoot}>
            {props.notifications.map((notification) => (
                <NotificationComponent
                    key={notification.id}
                    notification={notification}
                    onRemove={props.removeNotification}
                />
            ))}
        </ul>
    );
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