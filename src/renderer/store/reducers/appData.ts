import { Reducer, AnyAction } from "redux";
import I18String, { ISO639Locale } from '@axc/react-components/display/i18string';
import { SET_LOCALE, SET_APP_DATA, UPDATE_APP_DATA, RESET_APP_DATA } from "../../actions/appData";
import { SELECT_WIKI, selectWiki } from "../../actions/wikis";

export interface AppData {
    background: string,
    locale: ISO639Locale,
    selectedWiki: string
}


export const defaultAppData: AppData = {
    background: 'resources/images/landscape.jpg',
    locale: ISO639Locale.en,
    selectedWiki: undefined
};

export const AppDataReducer: Reducer<AppData> = (state: AppData = defaultAppData, action: AnyAction) => {
    switch (action.type) {
        case SELECT_WIKI:
            return {
                ...state,
                selectedWiki: action.wiki
            };
        case SET_LOCALE:
            return {
                ...state,
                locale: action.locale
            };
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