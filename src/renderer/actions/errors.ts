import { AnyAction } from "redux";

export interface ErrorAction {
    type: 'ERROR',
    code: number,
    message: string
};


export const isErrorAction = (obj: AnyAction): obj is ErrorAction=>{
    return obj.type === 'ERROR';
}

export const error: (message: string)=>ErrorAction= (message)=>{
    return {
        type: 'ERROR',
        code: 0,
        message
    }
}