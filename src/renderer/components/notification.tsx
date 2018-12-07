import * as React from 'react';
import { Notification } from "../store/reducers/notifications";
import I18String from '@axc/react-components/display/i18string';




interface ComponentProps {
    notification: Notification
    onRemove: (id: string) => any,
    className?: string
}

interface ComponentState {
    removing: boolean
}


export class NotificationComponent extends React.PureComponent<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            removing: false
        }
    }
    onRemove = () => {
        this.setState(() => ({
            removing: true
        }), () => {
            setTimeout(() => {
                this.props.onRemove(this.props.notification.id);
            }, 400);
        });
    }
    render() {
        const { notification } = this.props;
        let className = 'notification';

        if (this.props.className) {
            className += ' ' + this.props.className;
        }
        if (this.state.removing) {
            className += ' removed-notification';
        }
        return (
            <li className={className}>
                <div key='icon' className='notification__icon'>
                    <i className='material-icons'>
                        {notification.icon}
                    </i>
                </div>
                <div key='contents' className='notification__contents'>
                    <div className='notification__title'>
                        <I18String text={notification.title} format='capitalizeFirst' />
                    </div>
                    <div className='notification__description'>
                        <I18String text={notification.description} format='capitalizeFirst' />
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


export default NotificationComponent;