import { Reducer, AnyAction } from "redux";
import I18String, {ISO639Locale} from '@axc/react-components/display/i18string';

export interface AppData{
    backgroundImage: string,
    lang: ISO639Locale
}


const defaultState: AppData = {
    backgroundImage: 'resources/images/landscape.jpg',
    lang: ISO639Locale.en
};

export const AppDataReducer: Reducer<AppData> = (state: AppData = defaultState, action: AnyAction) =>{
    switch(action.type){
        default:
            return state;
    }
}

export default AppDataReducer;