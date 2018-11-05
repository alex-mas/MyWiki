
import { ActionCreator, Dispatch, Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { LocaleLayout } from "@axc/react-components/display/i18string";
import { ErrorAction } from "./errors";
import { AppState } from "../store/store";


export interface SetLocaleAction extends Action<string>{
    locale: string,
    localeData: LocaleLayout
}
export type SetLocaleActionCreator = ActionCreator<ThunkAction<Promise<ErrorAction | SetLocaleAction>,AppState, void, ErrorAction | SetLocaleAction>>;

export const setLocale: SetLocaleActionCreator = (locale: string)=>{
    return (dispatch, getState) =>{
        return (async ()=>{
            return dispatch({
                type: 'SET_LOCALE',
                locale: 'es',
                localeData: {

                }
            })
        })()
    }
}