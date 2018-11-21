import { Reducer, AnyAction } from "redux";
import I18String, { ISO639Locale } from '@axc/react-components/display/i18string';
import { SET_LOCALE, SET_APP_DATA, UPDATE_APP_DATA, RESET_APP_DATA, SET_APP_AUTO_SAVE, SET_APP_AUTO_SAVE_INTERVAL, SET_APP_BACKGROUND, SetAppAutoSaveAction } from "../../actions/appData";
import { SELECT_WIKI, selectWiki } from "../../actions/wikis";
import { createReducer } from "../reducer";

export interface AppData {
    background: string,
    locale: ISO639Locale,
    shouldAutoSave: boolean,
    autoSaveInterval: number
}


export const defaultAppData: AppData = {
    background: 'resources/images/landscape.jpg',
    locale: ISO639Locale.en,
    shouldAutoSave: false,
    autoSaveInterval: 1
};



export const AppDataReducer: Reducer<AppData> = (state: AppData = defaultAppData, action: AnyAction) => {
    switch (action.type) {
        case SET_APP_AUTO_SAVE:
            return {
                ...state,
                shouldAutoSave: action.shouldAutoSave
            }
        case SET_APP_AUTO_SAVE_INTERVAL:
            return {
                ...state,
                autoSaveInterval: action.autoSaveInterval
            }
        case SET_LOCALE:
            return {
                ...state,
                locale: action.locale
            };
        case SET_APP_BACKGROUND:
            return{
                ...state,
                background: action.background
            }
        case SET_APP_DATA:
            return action.data;
        case UPDATE_APP_DATA:
            return {
                ...state,
                ...action.data
            };
        case RESET_APP_DATA:
            return defaultAppData;
        default:
            return state;
    }
}

export default AppDataReducer;