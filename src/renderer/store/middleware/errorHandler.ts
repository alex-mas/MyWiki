import { ErrorAction, isErrorAction } from "../../actions/errors";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";


export const errorHandler:()=> (next: Function) => (action: AnyAction | ThunkAction<any,any,any,any>) => void = () =>{
    return (next: Function) => (action: AnyAction | ThunkAction<any,any,any,any>) => {
        if(typeof action === 'object' && isErrorAction(action)){
            console.warn(`ERROR(${action.code}): ${action.message} `);
        }
        next(action);
    }
}

export default errorHandler;

