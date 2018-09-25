import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/store';
import AppRouter from './router/router';


console.log('working client !!');


const myVar = 3;
console.log(myVar);

const appRoot = document.getElementById('app');

export const store = configureStore();


const App =(
    <Provider store={store}>
        <AppRouter/>
    </Provider>
);



ReactDOM.render(App, appRoot);
