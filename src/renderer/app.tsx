import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as fs from 'fs';
//@ts-ignore
require('./styles/index.scss');
//@ts-ignore
require('../../../../libraries/alex components/dist/styles/axc-styles.css');
import { Provider } from 'react-redux';
import configureStore from './store/store';
import AppRouter from './router/router';
import { loadWikis } from './actions/wikis';
import { WikiMetaData } from './store/reducers/wikis';
import { fsError } from './actions/errors';



const appRoot = document.getElementById('app');

export const store = configureStore();



const App = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);

ReactDOM.render(App, appRoot);


window.onload = () => {
    console.log('loading state from local storage');
    const wikis: WikiMetaData[] | undefined = JSON.parse(localStorage.getItem('myWikis'));
    let wikisFs: WikiMetaData[] = [];
    fs.readdir('./wikis', (err, files) => {
        if (err) {
            console.warn(err);
            store.dispatch(fsError('Error loading meta-data from filesystem'));
        } else {
            console.log('About to parse contained wikis: ',files);
            files.forEach((file) => {
                try{
                    const data = fs.readFileSync(`./wikis/${file}/myWiki.config.json`, 'utf8');
                    wikisFs.push(JSON.parse(data));
                }catch(e){
                    console.warn('Error while parsing wiki meta data',e);
                }

            });
            store.dispatch(loadWikis(wikisFs));
        }
    });
}

window.onbeforeunload = () => {
    const wikis = store.getState().wikis;
    wikis.forEach((wiki, index) => {
        fs.writeFile(`./wikis/${wiki.name}(${wiki.id})/myWiki.config.json`, JSON.stringify(wiki), 'utf8', (err) => {
            if (err) {
                store.dispatch(fsError('Error saving wiki configuration files'));
            }
        });
    });
}
