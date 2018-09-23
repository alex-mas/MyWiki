import { createStore, combineReducers, applyMiddleware, compose, Dispatch, Store } from 'redux';
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import thunk from 'redux-thunk';
import errorHandler from './middleware/errorHandler';
import wikis from './reducers/wikis';
import userData from './reducers/userData';


export type ReduxAction = AnyAction | ThunkAction<any,any,any,any>;

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        combineReducers({
            wikis,
            userData
        }),
        composeEnhancers(applyMiddleware(thunk, errorHandler))
    );
    return store;
}
