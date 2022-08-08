import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { isErrorAction } from "../../actions/errors";
const fs = require('fs');

export const errorHandler: () => (next: Function) => (action: AnyAction | ThunkAction<any, any, any, any>) => void = () => {
  return (next: Function) => (action: AnyAction | ThunkAction<any, any, any, any>) => {
    if (typeof action === 'object' && isErrorAction(action)) {
      const errMsg = `ERROR(${action.code}): ${action.message} `;
      if (process.env.NODE_ENV === 'development') {
        console.warn(errMsg);
      }
      fs.appendFile(
        './logs.txt',
        errMsg + '\n'
      );
    }
    next(action);
  }
}

export default errorHandler;

