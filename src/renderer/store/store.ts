import { createStore, combineReducers, applyMiddleware, compose, Dispatch, Store, Reducer, Middleware } from 'redux';
import { AnyAction } from "redux";
import { ThunkAction, ThunkMiddleware } from "redux-thunk";
import thunk from 'redux-thunk';
import errorHandler from './middleware/errorHandler';
import wikis, { WikiMetadata } from './reducers/wikis';
import appData, { AppData } from './reducers/appData';
import selectedWiki from './reducers/selectedWiki';
import plugins, { PluginState } from './reducers/plugins';
import i18n, { I18N } from './reducers/i18n';

export type StoreAction = AnyAction | ThunkAction<AnyAction,AppState,any,AnyAction>;

export interface AppState{
    wikis: WikiMetadata[],
    appData: AppData,
    selectedWiki: WikiMetadata,
    plugins: PluginState,
    i18n: I18N
}

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


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
