import { Reducer, AnyAction } from "redux";
import I18String, {ISO639Locale, ISO639Locales, LocaleLayout} from '@axc/react-components/dist/display/i18string';

export type I18N = ISO639Locales;

const defaultState: I18N = {
};

export const I18NReducer: Reducer<I18N> = (state: I18N = defaultState, action: AnyAction) =>{
    switch(action.type){
        default:
            return state;
    }
}

export default I18NReducer;