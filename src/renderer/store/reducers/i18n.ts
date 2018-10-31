import { Reducer, AnyAction } from "redux";
import I18String, {ISO639Locale, ISO639Locales, LocaleLayout} from '@axc/react-components/display/i18string';
import defaultLocales from '../../../static/locales.json';

export type I18N = ISO639Locales;

const defaultState: I18N = defaultLocales || {};

export const I18NReducer: Reducer<I18N> = (state: I18N = defaultState, action: AnyAction) =>{
    switch(action.type){
        default:
            return state;
    }
}

export default I18NReducer;