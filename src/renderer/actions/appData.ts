import { AppData, defaultAppData } from "../store/reducers/appData";
import { Action, ActionCreator, AnyAction } from "redux";
import { LocaleLayout, ISO639Locale } from "@axc/react-components/display/i18string";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { ErrorAction, fsError } from "./errors";
import * as fsp from '../../utils/promisify-fs';
import { ActionWithPayload, ACreator, AsyncACreator} from "../../utils/typeUtils";
import { store } from "../app";
import { createNotification } from "./notifications";


export const SET_APP_DATA = 'SET_APP_DATA';
export const UPDATE_APP_DATA = 'UPDATE_APP_DATA';
export const RESET_APP_DATA = 'RESET_APP_DATA';
export const SET_LOCALE = 'SET_LOCALE';
export const SET_APP_BACKGROUND = 'SET_APP_BACKGROUND';
export const SET_APP_AUTO_SAVE = 'SHOULD_AUTO_SAVE';
export const SET_APP_AUTO_SAVE_INTERVAL = 'SHOULD_AUTO_SAVE_INTERVAL';




export type ASetAppData = ActionWithPayload<{data: AppData}>;
export type SetAppDataActionCreator = AsyncACreator<[AppData],ASetAppData>

export const setAppData: SetAppDataActionCreator = (newData) => {
    return(dispatch, getState)=>{
        dispatch(setLocale(newData.locale));
        dispatch({
            type: SET_APP_DATA,
            data: newData
        });
    }
}


export type AResetAppData = Action<string>;
export type ResetAppDataActionCreator = AsyncACreator<any, AResetAppData>


export const resetAppData: ResetAppDataActionCreator = () => {
    return (dispatch, getState) => {
        dispatch(setLocale(defaultAppData.locale));
        dispatch({
            type: RESET_APP_DATA
        });
    }
}




export type ASetLocale = ActionWithPayload<{
    locale: string,
    localeData: LocaleLayout
}>;
export type SetLocaleActionCreator = AsyncACreator<[ISO639Locale],ASetLocale, ASetLocale>

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
            dispatch(fsError('error fetching locale data'));
            dispatch(createNotification('sorry', 'requested language isn\'t available', 'warning'))
            throw e;
        }
    }
}

export type ASetAppBg = ActionWithPayload<{ background: string }>;
export type SetAppBgActionCreator = ACreator<[string],ASetAppBg>;

export const setAppBackground: SetAppBgActionCreator = (background: string) => {
    return {
        type: SET_APP_BACKGROUND,
        background
    };
}


export type ASetAppAutoSave = ActionWithPayload<{ shouldAutoSave: boolean }>;
export type SetAppAutoSaveCreator = ACreator<[boolean],ASetAppAutoSave>;

export const setAppAutoSave: SetAppAutoSaveCreator = (shouldAutoSave:boolean ) => {
    return {
        type: SET_APP_AUTO_SAVE,
        shouldAutoSave
    };
}

export type ASetAppAutoSaveInterval = ActionWithPayload<{ autoSaveInterval: number }>;
export type SetAppAutoSaveIntervalCreator = ACreator<[number],ASetAppAutoSaveInterval>;

export const setAppAutoSaveInterval: SetAppAutoSaveIntervalCreator = (autoSaveInterval:number ) => {
    return {
        type: SET_APP_AUTO_SAVE_INTERVAL,
        autoSaveInterval
    };
}


export type ALoadAppData = Action<string>;

export type LoadAppDataActionCreator = AsyncACreator<any,ALoadAppData,void>

export const loadAppData: LoadAppDataActionCreator = ()=>{
    return async (dispatch,getState)=>{
        try{
            const appDataContents = await fsp.readFile('./appConfig/app.config.json', 'utf8');
            const appData: AppData = JSON.parse(appDataContents);
            //@ts-ignore
            dispatch(setAppData(appData));
        }catch(e){
            dispatch(fsError('error parsing app configuration'));
            throw e;
        }
    }
}



export const saveAppData = ()=>{
    const appData = store.getState().appData;
    if(appData){
        fsp.writeFile('./appConfig/app.config.json', JSON.stringify(appData), 'utf8')
        .then(()=>{

        })
        .catch((e)=>{
            store.dispatch(fsError('error serializing and saving app configuration'));
            throw e;
        });
    }
}



export default {
    setAppData,
    resetAppData,
    setLocale,
    setAppBackground
}