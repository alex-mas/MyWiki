import { Action, AnyAction, Reducer, combineReducers } from "redux";


export type ReducerContainer<T = {[key: string]: Reducer}> = T;

type ReducerHandler<T, A extends AnyAction = any> = (state:T, action: A)=>T;

export interface ReducerHandlers<T> {
    [key: string]: ReducerHandler<T>
}

export const createReducer = <T>(initialState: T, handlers: ReducerHandlers<T>) => {
    return (state: T = initialState, action: AnyAction) => {
        if (handlers[action.type]) {
            return handlers[action.type](state, action);
        } else if(handlers.default){
            return handlers.default(state,action);
        }else{
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