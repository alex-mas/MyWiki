import * as React from 'react';
import { connect } from 'react-redux';
import { Notification } from '../store/reducers/notifications';
import { AppState } from '../store/store';
import { removeNotification, removeAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../actions/notifications';
import NotificationList from './notificationList';
import NotificationsButton from './notificationsButton';


interface OwnProps {

}
interface DispatchProps {
    markAllNotificationsAsRead: typeof markAllNotificationsAsRead
}
type Props = OwnProps & DispatchProps;

interface State {
    shouldDisplayNotifications: boolean
}


export class Notifications extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            shouldDisplayNotifications: false
        }
    }
    toggleNotifications = () => {
        this.setState((prevState) => {
            const shouldDisplayNotifications = !prevState.shouldDisplayNotifications;
            if (shouldDisplayNotifications) {
                this.props.markAllNotificationsAsRead();
            }
            return {
                shouldDisplayNotifications
            };
        });
    }
    render() {
        return (
            <div className='notification-container'>
                <NotificationsButton
                    onClick={this.toggleNotifications}
                />
                <NotificationList
                    isActive={this.state.shouldDisplayNotifications}
                />
            </div>
        )
    }
}

export default connect(
    undefined,
    {
        markAllNotificationsAsRead
    }
)(Notifications);