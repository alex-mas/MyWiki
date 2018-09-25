import { AnyAction, ActionCreator } from "redux";

export type ErrorActionCreator = ActionCreator<ErrorAction>;

export interface ErrorAction {
    type: 'ERROR',
    code: number,
    message: string
};

export enum ErrorActionCodes{
    UNSPECIFIEED = 0,
    FS = 1,
    NETWORK = 2
}

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

export type FsErrorActionCreator = (message:string)=> ErrorAction;

export const fsError: FsErrorActionCreator = (message: string)=>{
    return error(message, ErrorActionCodes.FS);
}


export default {
    isErrorAction,
    fsError,
    error,
    ErrorActionCodes
}