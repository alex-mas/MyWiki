import { createStore, combineReducers, applyMiddleware, compose, Dispatch, Store, Reducer,Middleware, ReducersMapObject } from 'redux';
import { AnyAction } from "redux";
import { ThunkAction, ThunkMiddleware } from "redux-thunk";
import thunk from 'redux-thunk';
import errorHandler from './middleware/errorHandler';
import wikis, { WikiMetadata } from './reducers/wikis';
import appData, { AppData } from './reducers/appData';
import selectedWiki from './reducers/selectedWiki';
import plugins, { PluginState } from './reducers/plugins';
import i18n, { I18N } from './reducers/i18n';
import { ReducerContainer, dynamicCombine } from './reducer';
export type StoreAction = AnyAction | ThunkAction<AnyAction, AppState, any, AnyAction>;

export interface AppState {
    wikis: WikiMetadata[],
    appData: AppData,
    selectedWiki: WikiMetadata,
    plugins: PluginState,
    i18n: I18N,
    [key: string]: any
}

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;





export const configureStore = () => {
    const store: Store<AppState, AnyAction> = createStore(
        combineReducers<AppState, AnyAction>({
            wikis,
            appData,
            selectedWiki,
            plugins,
            i18n
        }),
        composeEnhancers(applyMiddleware(thunk, errorHandler))
    );
    return store;
}

export class AppStore {
    private store: Store<AppState>;
    private pluginReducers: ReducerContainer = {};
    private defaultReducers: ReducerContainer = {};
    private currentState: AppState;
    constructor(defaultReducers: ReducerContainer, middleware: Middleware[]) {
        this.store = configureStore();
        this.defaultReducers = defaultReducers;
    }
    onReducerChange = () => {
        this.store.replaceReducer(dynamicCombine(this.defaultReducers, this.pluginReducers));
    }
    isReducerKeyValid = (key: string) => {
        return true;
    }
    registerReducer = <T extends S, S>(key: string, reducer: Reducer<T>) => {
        if (this.isReducerKeyValid(key)) {
            this.pluginReducers[key] = reducer;
            this.onReducerChange();
        }
    }
}



export default () => {
    const store: Store<AppState, AnyAction> = createStore(
        combineReducers<AppState, AnyAction>({
            wikis,
            appData,
            selectedWiki,
            plugins,
            i18n
        }),
        composeEnhancers(applyMiddleware(thunk, errorHandler))
    );
    return store;
}