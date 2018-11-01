import { AppData } from "../store/reducers/appData";
import { Action, ActionCreator } from "redux";


export type AppDataAction = Action<string> & { data: AppData};

export type AppDataActionCreator = ActionCreator<AppDataAction>
export const setAppData: AppDataActionCreator = (newData:AppData)=>{
    return{
        type:'SET_APP_DATA',
        data: newData
    }
}

export const resetAppData: ActionCreator<void> = ()=>{
    return{
        type: 'RESET_APP_DATA'
    }
}


export default {
    setAppData,
    resetAppData
}