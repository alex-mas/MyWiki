import { AnyAction, ActionCreator } from "redux";

export const ERROR = 'ERROR';
export type ERROR = 'ERROR';

export type ErrorActionCreator = (message: string, code: number)=>ErrorAction;

export interface ErrorAction {
    type: ERROR,
    code: number,
    message: string
};

export enum ErrorActionCode{
    UNSPECIFIEED = 0,
    FS = 1,
    NETWORK = 2,
    WRONG_PARAMS = 3,
    INCORRECT_ACTION = 4,
    PLUGIN_RUNTIME_ERROR = 5
}

export const isErrorAction = (obj: AnyAction): obj is ErrorAction=>{
    return obj.type === ERROR;
}

export const errorAction: ErrorActionCreator = (message: string, code: number)=>{
    return {
        type: ERROR,
        code,
        message
    }
}

export type FsErrorActionCreator = (message:string)=> ErrorAction;

export const fsError: FsErrorActionCreator = (message: string)=>{
    return errorAction(message, ErrorActionCode.FS);
}




export default {
    isErrorAction,
    fsError,
    errorAction,
    ErrorActionCode
}