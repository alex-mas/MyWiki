import { Action, AnyAction, Reducer, combineReducers } from "redux";

export type ReducerContainer<T = { [key: string]: Reducer }> = T;

type ReducerHandler<T, A extends AnyAction = any> = (state: T, action: A) => T;
type ReducerPersistor<T> = (state: T) => void;
type ReducerSanitizer<T, A extends AnyAction = any> = (state: T, action: A) => boolean;

export interface ReducerHandlers<T> {
    [key: string]: ReducerHandler<T>
}
export interface ReducerPersistors<T> {
    [key: string]: ReducerPersistor<T>
}
export interface ReducerSanitizers<T> {
    [key: string]: ReducerSanitizer<T>
}

export const createReducer = <T>(initialState: T, handlers: ReducerHandlers<T>, persistors?: ReducerPersistors<T>, sanitizers?: ReducerSanitizers<T>) => {
    return (prevState: T = initialState, action: AnyAction) => {
        let nextState: T;
        if (handlers[action.type]) {
            if (sanitizers && sanitizers[action.type]) {
                if (sanitizers[action.type](prevState, action)) {
                    nextState = handlers[action.type](prevState, action);
                }
            } else {
                nextState = handlers[action.type](prevState, action);
            }
        } else if (handlers.default) {
            nextState = handlers.default(prevState, action);
        } else {
            return prevState;
        }
        if (persistors && persistors[action.type]) {
            persistors[action.type](nextState);
        }
        return nextState;
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