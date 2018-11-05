import { Reducer, AnyAction } from "redux";
import I18String, {ISO639Locale, ISO639Locales, LocaleLayout} from '@axc/react-components/display/i18string';
import * as defaultLocales from '../../../static/locales.json';
//@ts-ignore
import _cloneDeep from 'lodash.clonedeep';
const cloneDeep: <T>(any:T)=>T = _cloneDeep;

export type I18N = LocaleLayout;

const defaultState: I18N = {};

export const I18NReducer: Reducer<I18N> = (state: I18N = defaultState, action: AnyAction) =>{
    switch(action.type){
        case 'ADD_TRADUCTIONS':
            {
                const newState = cloneDeep(state);
                //bootstrap traductions into state;
                return newState;
            }
        case 'SET_LOCALE':
            return action.localeData;
        default:
            return state;
    }
}

export default I18NReducer;