import { createStore, combineReducers, applyMiddleware, compose, Dispatch, Store, Reducer,Middleware, ReducersMapObject, Action } from 'redux';
import { AnyAction } from "redux";
import { ThunkAction, ThunkMiddleware, ThunkDispatch } from "redux-thunk";
import thunk from 'redux-thunk';
import errorHandler from './middleware/errorHandler';
import wikis, { WikiMetadata } from './reducers/wikis';
import appData, { AppData } from './reducers/appData';
import selectedWiki from './reducers/selectedWiki';
import plugins, { PluginState } from './reducers/plugins';
import i18n, { I18N } from './reducers/i18n';
import { ReducerContainer, dynamicCombine } from '../../utils/reducer';
import notifications, { Notification } from './reducers/notifications';
import readOnly from '../../utils/readonly';
export type StoreAction = AnyAction | ThunkAction<AnyAction, AppState, any, AnyAction>;

export interface AppState {
    wikis: WikiMetadata[],
    appData: AppData,
    selectedWiki: WikiMetadata,
    plugins: PluginState,
    notifications: Notification[],
    i18n: I18N,
    [key: string]: any
}

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const defaultReducers = {
    wikis,
    appData,
    selectedWiki,
    plugins,
    i18n,
    notifications
}


export const configureStore = () => {
    const store: Store<AppState, AnyAction> = createStore(
        combineReducers<AppState, AnyAction>(defaultReducers),
        composeEnhancers(applyMiddleware(thunk, errorHandler))
    );
    store.dispatch = store.dispatch as ThunkDispatch<AppState,undefined,AnyAction>;
    return store;
}

export class AppStore {
    readonly store: Store<AppState>;
    private pluginReducers: ReducerContainer = {};
    private defaultReducers: ReducerContainer = defaultReducers;
    private currentState: AppState;
    constructor() {
        this.store = readOnly(configureStore());
    }
    onReducerChange = () => {
        this.store.replaceReducer(dynamicCombine(this.defaultReducers, this.pluginReducers));
    }
    isReducerKeyValid = (key: string) => {
        return !this.pluginReducers[key] && !this.defaultReducers[key];
    }
    /**
     * Registers  new reducer in the given key of app state given that the key doesnt clash without any existing reducer
     */
    registerReducer = <T extends any>(key: string, reducer: Reducer<T>) => {
        if (this.isReducerKeyValid(key)) {
            this.pluginReducers[key] = reducer;
            this.onReducerChange();
            return true;
        }else{
            return false;
        }
    }
    get = ()=>{
        return this.store;
    }
    /**
     * Wrapper over redux store to validate actions, designed to prevent plugins from accidentaly
     * dispatching actions that would mess up with app state. 
     * 
     */
    dispatch = <A extends Action<any> = AnyAction>(action: A)=>{
        //TODO: validate the action first
        return this.store.dispatch(action);
    }
}




export default AppStore