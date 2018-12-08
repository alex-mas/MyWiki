import { Reducer, AnyAction } from "redux";
import I18String, {ISO639Locale, LocaleLayout} from '@axc/react-components/display/i18string';
//@ts-ignore
import _cloneDeep from 'lodash.clonedeep';
import { SET_LOCALE, ASetLocale } from "../../actions/appData";
import { createReducer } from "../../../utils/reducer";
const cloneDeep: <T>(any:T)=>T = _cloneDeep;

export type I18N = LocaleLayout;

const defaultState: I18N = {};


export const I18NReducer = createReducer<I18N>(
    defaultState,
    {
        [SET_LOCALE]: (state, action: ASetLocale)=>{
            return action.localeData;
        }
    }
)


export default I18NReducer;