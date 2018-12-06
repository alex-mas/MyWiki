import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../store/store';
import { getRecentNotifications } from '../selectors/notifications';
import { Notification } from '../store/reducers/notifications';
import { removeNotification } from '../actions/notifications';
import NotificationComponent from './notification';

interface ReduxProps {
    notifications: Notification[]
}
interface DispatchProps {
    removeNotification: typeof removeNotification
}
interface OwnProps {
    isActive: boolean
}

type ComponentProps = OwnProps & ReduxProps & DispatchProps;

export class RecentNotifications extends React.Component<ComponentProps, any>{
    constructor(props: any) {
        super(props);
    }
    render() {
        const notifications = getRecentNotifications(this.props.notifications, 2500);
        if (!this.props.isActive || notifications.length === 0) {
            return null;
        }
        return (
            <ul className='notification-list'>
                {notifications.map((notification) => {
                    setTimeout(() => {
                        this.forceUpdate();
                    }, 2500 -(Date.now()-notification.createdAt) + 1);
                    return (
                        <NotificationComponent
                            key={notification.id}
                            notification={notification}
                            className='recent-notification'
                            onRemove={this.props.removeNotification}
                        />
                    )
                })}
            </ul>

        );
    }
}

export default connect(
    (state: AppState, props: OwnProps) => {
        return {
            notifications: state.notifications
        }
    },
    {
        removeNotification
    }
)(RecentNotifications);