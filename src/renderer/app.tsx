import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as fs from 'fs';
//@ts-ignore
require('@axc/react-components/styles/axc-styles.css');
//@ts-ignore
require('./styles/index.scss');

import { Provider, connect } from 'react-redux';
import configureStore, { AppState } from './store/store';
import AppRouter from './router/router';
import { loadWikis } from './actions/wikis';
import { WikiMetaData } from './store/reducers/wikis';
import { fsError } from './actions/errors';
import { parsePlugins } from './actions/plugins';
import I18String, { I18nSystem as _I18nSystem, I18nSystemProps } from '@axc/react-components/display/i18string';
import { PromptSystem } from '@axc/react-components/interactive/prompt';



const appRoot = document.getElementById('app');

export const store = configureStore();



const I18nSystem = connect((state: AppState, props) => {
    console.log('Re-setting props to I18nSystem', state, props);
    return {
        localeData: {
            locale: state.appData.locale,
            locales: state.i18n
        }
    }
})(_I18nSystem);


const App = (
    <Provider store={store}>
        <PromptSystem>
            <I18nSystem>
                <AppRouter />
            </I18nSystem>
        </PromptSystem>
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
            console.log('About to parse contained wikis: ', files);
            files.forEach((file) => {
                try {
                    const data = fs.readFileSync(`./wikis/${file}/myWiki.config.json`, 'utf8');
                    const wiki: WikiMetaData = JSON.parse(data);
                    if (!wiki.description) {
                        wiki.description = '';
                    }
                    wikisFs.push(wiki);
                } catch (e) {
                    console.warn('Error while parsing wiki meta data', e);
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


//@ts-ignore
store.dispatch(parsePlugins());



