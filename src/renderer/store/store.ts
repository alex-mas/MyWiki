import { createStore, combineReducers, applyMiddleware, compose, Dispatch, Store } from 'redux';
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import thunk from 'redux-thunk';
import errorHandler from './middleware/errorHandler';
import wikis, { WikiMetaData } from './reducers/wikis';
import appData, { AppData } from './reducers/appData';
import selectedWiki, { SelectedWiki } from './reducers/selectedWiki';
import plugins, { PluginState } from './reducers/plugins';
import i18n, { I18N } from './reducers/i18n';

export type ReduxAction = AnyAction | ThunkAction<any,AppState,any,any>;

export interface AppState{
    wikis: WikiMetaData[],
    appData: AppData,
    selectedWiki: SelectedWiki,
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
