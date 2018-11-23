import uuid from 'uuid/v4';
import { ActionWithPayload, ACreator } from '../../utils/typeUtils';
import { Notification } from '../store/reducers/notifications';



export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const REMOVE_ALL_NOTIFICATIONS = 'REMOVE_ALL_NOTIFICATIONS';
export const MARK_NOTIFICATION_AS_READ = 'MARK_NOTIFICATION_AS_READ';
export const MARK_ALL_NOTIFICATIONS_AS_READ = 'MARK_ALL_NOTIFICATIONS_AS_READ';



export type ACreateNotification = ActionWithPayload<{notification:Notification}>
export type ACreateNotificationCreator =ACreator<[string,string,string], ACreateNotification>
export const createNofication: ACreateNotificationCreator = (title: string, description: string, icon: string)=>{
    return{
        type: CREATE_NOTIFICATION,
        notification:{
            id: uuid(),
            title,
            description,
            icon,
            isRead: false
        }

    }
}




export type ARemoveNotification = ActionWithPayload<{id:string}>
export type ARemoveNotificationCreator =ACreator<[string], ARemoveNotification>
export const removeNotification: ARemoveNotificationCreator = (id:string)=>{
    return {
        type: REMOVE_NOTIFICATION,
        id
    }
}



export type ARemoveAllNotifications = ActionWithPayload<{}>
export type ARemoveAllNotificationsCreator =ACreator<[string], ARemoveAllNotifications>
export const removeAllNotifications: ARemoveAllNotificationsCreator = ()=>{
    return{
        type: REMOVE_ALL_NOTIFICATIONS
    }
}


export type AMarkNotificationAsRead = ActionWithPayload<{id:string}>
export type AMarkNotificationAsReadCreator =ACreator<[string], AMarkNotificationAsRead>
export const markNotificationAsRead: AMarkNotificationAsReadCreator = (id:string)=>{
    return{
        type:MARK_NOTIFICATION_AS_READ,
        id
    }
}

export type AMarkAllNotificationsAsRead = ActionWithPayload<{}>
export type AMarkAllNotificationsAsReadCreator =ACreator<[string], AMarkAllNotificationsAsRead>
export const markAllNotificationsAsRead = ()=>{
    return{
        type:MARK_ALL_NOTIFICATIONS_AS_READ
    }
}