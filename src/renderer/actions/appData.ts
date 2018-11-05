import { AppData, defaultAppData } from "../store/reducers/appData";
import { Action, ActionCreator, AnyAction } from "redux";
import { LocaleLayout, ISO639Locale } from "@axc/react-components/display/i18string";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { ErrorAction, fsError } from "./errors";
import * as fsp from '../../utils/promisify-fs';


export type AppDataAction = Action<string> & { data: AppData};

export type AppDataActionCreator = ActionCreator<AppDataAction>
export const setAppData: AppDataActionCreator = (newData:AppData)=>{
    return{
        type:'SET_APP_DATA',
        data: newData
    }
}


export type UpdateAppData = Action<string> & { data: Partial<AppData>};

export type UpdateAppDataCreator = ActionCreator<UpdateAppData>
export const updateAppData: UpdateAppDataCreator = (newData:Partial<AppData>)=>{
    return{
        type:'UPDATE_APP_DATA',
        data: newData
    }
}


export type ResetAppDataAction = Action<'RESET_APP_DATA'>;

export type ResetAppDataActionCreator = ActionCreator<ThunkAction<void,AppState, void, ErrorAction | SetLocaleAction | ResetAppDataAction>>;

export const resetAppData: ResetAppDataActionCreator = ()=>{
    return(dispatch, getState)=>{
        dispatch(setLocale(defaultAppData.locale));
        dispatch({
            type: 'RESET_APP_DATA'
        });
    }
}



export interface SetLocaleAction extends Action<string>{
    locale: string,
    localeData: LocaleLayout
}
export type SetLocaleActionCreator = ActionCreator<ThunkAction<Promise<any>,AppState, void, ErrorAction | SetLocaleAction>>;

const _setLocale = (locale: ISO639Locale, localeData: LocaleLayout)=>{
    return{
        type: 'SET_LOCALE',
        locale,
        localeData
    }
}
export const setLocale: SetLocaleActionCreator = (locale: ISO639Locale)=>{
    return (dispatch, getState) =>{
        return (async ()=>{
            if(locale === 'en'){
                return dispatch(_setLocale(locale,{}));
            }
            try{
                const fileContents = await fsp.readFile(`./resources/locales/locale.${locale}.json`, 'utf8');
                const localeData = JSON.parse(fileContents);
                return dispatch(_setLocale(locale,localeData));
            }catch(e){
                console.warn(e);
                return dispatch(fsError('error fetching locale data'));
            }
        })();
    }
}

export type SetAppBgAction = Action & {background: string};
export type SetAppBgActionCreator = ActionCreator<SetAppBgAction>;

export const setAppBackground: SetAppBgActionCreator = (background: string)=>{
    return{
        type: 'SET_APP_BACKGROUND',
        background
    };
}


export default {
    setAppData,
    resetAppData,
    setLocale,
    setAppBackground
}