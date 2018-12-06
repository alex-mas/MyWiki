import { AppState } from "../store/store";
import { Notification } from "../store/reducers/notifications";



export const getRecentNotifications = (state: AppState | Notification[], timeLimit: number)=>{
    const now = Date.now();
    if(Array.isArray(state)){
        return state.filter((notification)=>now-notification.createdAt < timeLimit);
    }
    return state.notifications.filter((notification)=>now-notification.createdAt < timeLimit);
}


export default {
    getRecentNotifications
}