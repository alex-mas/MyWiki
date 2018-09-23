import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/store';


console.log('working client !!');


const myVar = 3;
console.log(myVar);

const appRoot = document.getElementById('app');

const store = configureStore();

const App =(
    <Provider store={store}>
        <div>
            Hello world!
        </div>
    </Provider>
);



ReactDOM.render(App, appRoot);
