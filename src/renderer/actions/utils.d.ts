import { AppState } from "../store/store";
import { ThunkAction } from "redux-thunk";
import { ActionCreator, Action } from "redux";
import { ErrorAction } from "./errors";





//https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
type Filter<T, U> = T extends U ? T : never; 


/**
 * TODO: Make casting a wrong action throw error at compile time by itself, right now it will just make compiler fail once returning the action in a creator
 * T = Type that the action will have
 * P = Action payload payload must not implement a type property as it would override the action type
 * 
 */ 
export type ActionWithPayload<P> = Action<string> & P; 




/**
 * 
 * P = Parameters of the action creator
 * R = Return value of the action, what is returned inside the (dispatch, getState)  function
 * A = Action that is dispatched inside the dispatch provided by the function
 * 
 * 
 */
export type AsyncACreator<P extends any[],R,A extends Action> = (...args: P) =>ThunkAction<R,AppState, void, ErrorAction | A>

export type ACreator<P extends any[],A extends Action> = (...args: P) =>A;