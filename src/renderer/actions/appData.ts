import { AppData, defaultAppData } from "../store/reducers/appData";
import { Action, ActionCreator, AnyAction } from "redux";
import { LocaleLayout, ISO639Locale } from "@axc/react-components/display/i18string";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { ErrorAction, fsError } from "./errors";
import * as fsp from '../../utils/promisify-fs';
import { ActionWithPayload, ACreator, AsyncACreator} from "./utils";


export const SET_APP_DATA = 'SET_APP_DATA';
export const UPDATE_APP_DATA = 'UPDATE_APP_DATA';
export const RESET_APP_DATA = 'RESET_APP_DATA';
export const SET_LOCALE = 'SET_LOCALE';
export const SET_APP_BACKGROUND = 'SET_APP_BACKGROUND';


export type AppDataAction = ActionWithPayload<{data: AppData}>;
export type AppDataActionCreator = AsyncACreator<[AppData],AppDataAction>





export const setAppData: AppDataActionCreator = (newData) => {
    return(dispatch, getState)=>{
        dispatch(setLocale(newData.locale));
        dispatch({
            type: SET_APP_DATA,
            data: newData
        });
    }

}

export type ResetAppDataAction = Action<string>;
export type ResetAppDataActionCreator = AsyncACreator<any, ResetAppDataAction>


export const resetAppData: ResetAppDataActionCreator = () => {
    return (dispatch, getState) => {
        dispatch(setLocale(defaultAppData.locale));
        dispatch({
            type: RESET_APP_DATA
        });
    }
}




export type SetLocaleAction = ActionWithPayload<{
    locale: string,
    localeData: LocaleLayout
}>;
export type SetLocaleActionCreator = ActionCreator<ThunkAction<Promise<any>, AppState, void, ErrorAction | SetLocaleAction>>;

const _setLocale = (locale: ISO639Locale, localeData: LocaleLayout) => {
    return {
        type: SET_LOCALE,
        locale,
        localeData
    }
}
export const setLocale: SetLocaleActionCreator = (locale: ISO639Locale) => {
    return async(dispatch, getState) => {
        if (locale === 'en') {
            return dispatch(_setLocale(locale, {}));
        }
        try {
            const fileContents = await fsp.readFile(`./resources/locales/locale.${locale}.json`, 'utf8');
            const localeData = JSON.parse(fileContents);
            return dispatch(_setLocale(locale, localeData));
        } catch (e) {
            console.warn(e);
            dispatch(_setLocale(ISO639Locale.en, {}));
            return dispatch(fsError('error fetching locale data'));
        }
    }
}

export type SetAppBgAction = ActionWithPayload<{ background: string }>;
export type SetAppBgActionCreator = ACreator<[string],SetAppBgAction>;

export const setAppBackground: SetAppBgActionCreator = (background: string) => {
    return {
        type: SET_APP_BACKGROUND,
        background
    };
}


export default {
    setAppData,
    resetAppData,
    setLocale,
    setAppBackground
}