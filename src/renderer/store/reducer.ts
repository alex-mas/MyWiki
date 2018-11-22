import { Action, AnyAction, Reducer, combineReducers } from "redux";

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

export type ReducerContainer<T = {[key: string]: Reducer}> = T;


export interface ReducerHandlers<T, A extends AnyAction> {
    [key: string]: (state: T, action: A) => T
}

export const createReducer = <T, A extends AnyAction>(initialState: T, handlers: ReducerHandlers<T, A>) => {
    return (state: T = initialState, action: A) => {
        if (handlers[action.type]) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    }
}


/**
 * Assumes that container keys dont clash with each-other, else the last container to be assigned
 * 
 */
export const dynamicCombine = <T>(defaultReducers: T, ...containers: ReducerContainer[]) => {
    let reducerContainer: T & any = defaultReducers;
    containers.forEach((container) => {
        reducerContainer = Object.assign(reducerContainer, container);
    });
    return combineReducers<T & any>(reducerContainer);
}