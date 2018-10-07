import * as React from 'react';
import * as ReactDOM from 'react-dom';
//@ts-ignore
require('./styles/index.scss');
import {Provider} from 'react-redux';
import configureStore from './store/store';
import AppRouter from './router/router';
import { loadWikis } from './actions/wikis';
import { WikiMetaData } from './store/reducers/wikis';



const appRoot = document.getElementById('app');

export const store = configureStore();



const App =(
    <Provider store={store}>
        <AppRouter/>
    </Provider>
);

ReactDOM.render(App, appRoot);


window.onload = ()=>{
    console.log('loading state from local storage');
    const wikis: WikiMetaData[] | undefined = JSON.parse(localStorage.getItem('myWikis'));
    console.log('wikis: ',wikis);
    if(wikis){
        console.log('dispatching action');
        store.dispatch(loadWikis(wikis));
    }

}

window.onbeforeunload = ()=>{
    localStorage.setItem('myWikis', JSON.stringify(store.getState().wikis));
}
