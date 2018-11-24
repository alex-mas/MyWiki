import { Reducer, AnyAction } from "redux";
import { createReducer } from "../reducer";
import { 
    CREATE_NOTIFICATION, 
    ACreateNotification, 
    REMOVE_NOTIFICATION, 
    ARemoveNotification, 
    REMOVE_ALL_NOTIFICATIONS, 
    MARK_NOTIFICATION_AS_READ, 
    MARK_ALL_NOTIFICATIONS_AS_READ, 
    AMarkNotificationAsRead 
} from "../../actions/notifications";



export interface Notification {
    id: string,
    title: string,
    description: string,
    icon: string,
    isRead: boolean
}

export type NotificationState = Notification[];
const defaultNotificationState: NotificationState = []


export const notificatiopnReducer: Reducer<NotificationState> = (state: NotificationState = defaultNotificationState, action: AnyAction) => {
    switch (action.type) {
        default:
            return state;
    }
}

export const notificationReducer = createReducer<NotificationState>(
    defaultNotificationState,
    {
        [CREATE_NOTIFICATION]: (state,action: ACreateNotification)=>{
            return [...state, action.notification]
        },
        [REMOVE_NOTIFICATION]: (state,action:ARemoveNotification)=>{
            return state.filter((notification)=>notification.id !== action.id)
        },
        [REMOVE_ALL_NOTIFICATIONS]: (state,action)=>defaultNotificationState,
        [MARK_NOTIFICATION_AS_READ]:(state,action:AMarkNotificationAsRead)=>{
            return state.filter((notification)=>{
                if(notification.id !== action.id){
                    return{
                        ...notification,
                        isRead: true
                    }
                }else{
                    return notification;
                }
            })
        },
        [MARK_ALL_NOTIFICATIONS_AS_READ]:(state,action)=>{
            return state.map((notification)=>({...notification,isRead:true}))
        }
       
    }
);


export default notificationReducer;