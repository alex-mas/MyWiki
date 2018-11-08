import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as fs from 'fs';
import * as fsp from '../utils/promisify-fs';
//@ts-ignore
require('@axc/react-components/styles/axc-styles.css');
//@ts-ignore
require('./styles/index.scss');

import { Provider, connect } from 'react-redux';
import configureStore, { AppState } from './store/store';
import AppRouter from './router/router';
import { loadWikis, loadWiki } from './actions/wikis';
import { WikiMetaData } from './store/reducers/wikis';
import { fsError } from './actions/errors';
import { parsePlugins } from './actions/plugins';
import I18String, { I18nSystem as _I18nSystem, I18nSystemProps } from '@axc/react-components/display/i18string';
import { PromptSystem } from '@axc/react-components/interactive/prompt';
import { AnyAction } from 'redux';
//@ts-ignore
import * as ThreadManager from '@axc/thread-manager';


const appRoot = document.getElementById('app');

export const store = configureStore();

export const mlThreads = new ThreadManager('./workers/ml.js', {ammountOfWorkers: 1, distributionMethod: 'round_robin'});

const I18nSystem = connect((state: AppState, props) => {
    return {
        context: {
            locale: state.appData.locale,
            localeData: state.i18n
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

//TODO: Convert into actions and do window.onEvent = action

window.onload = async () => {
    const wikis: WikiMetaData[] | undefined = JSON.parse(localStorage.getItem('myWikis'));
    try {
        const files = await fsp.readdir('./wikis');
        files.forEach(async (file) => {
            try {
                //@ts-ignore
                store.dispatch(loadWiki(file));
            } catch (e) {
                store.dispatch(fsError('Error while parsing wiki meta data'));
            }
        });
    } catch (e) {
        store.dispatch(fsError('Error loading wiki meta-data'));
    }
}

window.onbeforeunload = () => {
    const wikis = store.getState().wikis;
    wikis.forEach(async (wiki, index) => {
        if (wiki) {
            try {
                fsp.writeFile(`./wikis/${wiki.id}/myWiki.config.json`, JSON.stringify(wiki), 'utf8');
            } catch (e) {
                store.dispatch(fsError('Error saving wiki configuration files'));
            }
        }
    });
}


//@ts-ignore
store.dispatch(parsePlugins());