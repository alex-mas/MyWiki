import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/store';


console.log('working client !!');

console.log(React);

const myVar = 3;
console.log(myVar);

const appRoot = document.getElementById('app');

const store = configureStore();

const App = (
    <Provider store={store}>
        Working!
    </Provider>
);




ReactDOM.render(App, appRoot);
