import { createStore, combineReducers, applyMiddleware, compose, Dispatch, Store } from 'redux';
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import thunk from 'redux-thunk';
import errorHandler from './middleware/errorHandler';
import wikis, { WikiMetaData } from './reducers/wikis';
import userData, { UserData } from './reducers/userData';
import selectedWiki, { SelectedWiki } from './reducers/selectedWiki';


export type ReduxAction = AnyAction | ThunkAction<any,any,any,any>;

export interface AppState{
    wikis: WikiMetaData[],
    userData: UserData,
    selectedWiki: SelectedWiki
}

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store: Store<AppState, AnyAction> = createStore(
        combineReducers<AppState, AnyAction>({
            wikis,
            userData,
            selectedWiki
        }),
        composeEnhancers(applyMiddleware(thunk, errorHandler))
    );
    return store;
}
