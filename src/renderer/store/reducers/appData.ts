import { Reducer, AnyAction } from "redux";
import I18String, { ISO639Locale } from '@axc/react-components/i18string';
import { SET_LOCALE, SET_APP_DATA, UPDATE_APP_DATA, RESET_APP_DATA, SET_APP_AUTO_SAVE, SET_APP_AUTO_SAVE_INTERVAL, SET_APP_BACKGROUND, ASetAppAutoSave, ASetAppAutoSaveInterval, ASetLocale, ASetAppBg, ASetAppData, LOAD_EXTERNAL_WIKI, ALoadExternalWiki, REMOVE_EXTERNAL_WIKI, ARemoveExternalWiki } from "../../actions/appData";
import { SELECT_WIKI, selectWiki } from "../../actions/wikis";
import { createReducer } from "../../../utils/reducer";

export interface AppData {
    background: string,
    locale: ISO639Locale,
    shouldAutoSave: boolean,
    autoSaveInterval: number,
    externalWikis: string[]
}


export const defaultAppData: AppData = {
    background: 'resources/images/landscape.jpg',
    locale: ISO639Locale.en,
    shouldAutoSave: false,
    autoSaveInterval: 1,
    externalWikis: []
};



export const AppDataReducer = createReducer<AppData>(
    defaultAppData,
    {
        [SET_APP_AUTO_SAVE]: (state,action: ASetAppAutoSave)=>{
            return {
                ...state,
                shouldAutoSave: action.shouldAutoSave
            }
        },
        [SET_APP_AUTO_SAVE_INTERVAL]: (state,action: ASetAppAutoSaveInterval)=>{
            return {
                ...state,
                autoSaveInterval: action.autoSaveInterval
            }
        },
        [SET_LOCALE]: (state,action: ASetLocale)=>{
            return {
                ...state,
                locale: action.locale as ISO639Locale
            };
        },
        [SET_APP_BACKGROUND]:(state,action: ASetAppBg)=>{
            return{
                ...state,
                background: action.background
            }
        },
        [SET_APP_DATA]:(state,action: ASetAppData)=>{
            return action.data;
        },
        [RESET_APP_DATA]:(state,action: ASetAppData)=>{
            return defaultAppData;
        },
        [LOAD_EXTERNAL_WIKI]: (state,action: ALoadExternalWiki)=>{
            return{
                ...state,
                externalWikis: [...state.externalWikis, action.path]
            };
        },
        [REMOVE_EXTERNAL_WIKI]: (state, action: ARemoveExternalWiki)=>{
            return{
                ...state,
                externalWikis: state.externalWikis.filter((wikiPath)=>wikiPath !== action.path)
            };
        }
    }
);


export default AppDataReducer;