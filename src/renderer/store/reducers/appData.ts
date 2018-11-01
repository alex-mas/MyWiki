import { Reducer, AnyAction } from "redux";
import I18String, {ISO639Locale} from '@axc/react-components/display/i18string';

export interface AppData{
    background: string,
    locale: ISO639Locale
}


const defaultState: AppData = {
    background: 'resources/images/landscape.jpg',
    locale: ISO639Locale.ca
};

export const AppDataReducer: Reducer<AppData> = (state: AppData = defaultState, action: AnyAction) =>{
    switch(action.type){
        case 'SET_APP_DATA':
            return action.data;
        case 'RESET_APP_DATA':
            return defaultState;
        default:
            return state;
    }
}

export default AppDataReducer;