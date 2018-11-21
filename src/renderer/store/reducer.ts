import { Action, AnyAction } from "redux";

/**
 * TODO: Do something like this but that infers action type so that you get intellisense insided the function
 function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
*/


export interface IReducerHandlers<T,A extends AnyAction> {
  [key:string]: (state: T, action: A)=>T
}

export const createReducer = <T, A extends AnyAction>(initialState: T, handlers: IReducerHandlers<T,A>)=>{
  return (state: T = initialState, action: A)=>{
    if(handlers[action.type]){
      return handlers[action.type](state,action);
    }else{
      return state;
    }
  }
}