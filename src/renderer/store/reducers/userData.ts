import { Reducer, AnyAction } from "redux";

export interface UserData{
    [x:string]: any
}


const defaultState: UserData = {

};

export const UserDataReducer: Reducer<UserData> = (state: UserData = defaultState, action: AnyAction) =>{
    switch(action.type){
        default:
            return state;
    }
}

export default UserDataReducer;