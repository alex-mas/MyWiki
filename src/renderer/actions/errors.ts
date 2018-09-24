import { AnyAction, ActionCreator } from "redux";

export type ErrorActionCreator = ActionCreator<ErrorAction>;

export interface ErrorAction {
    type: 'ERROR',
    code: number,
    message: string
};


export const isErrorAction = (obj: AnyAction): obj is ErrorAction=>{
    return obj.type === 'ERROR';
}

export const error: ErrorActionCreator = (message: string, code: number)=>{
    return {
        type: 'ERROR',
        code,
        message
    }
}
