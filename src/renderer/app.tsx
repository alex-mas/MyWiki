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
import { loadWikis, loadWiki } from './actions/wikis';
import { WikiMetaData } from './store/reducers/wikis';
import { fsError } from './actions/errors';
import { parsePlugins } from './actions/plugins';
import I18String, { I18nSystem as _I18nSystem, I18nSystemProps } from '@axc/react-components/display/i18string';
import { PromptSystem } from '@axc/react-components/interactive/prompt';
import { AnyAction } from 'redux';



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
    fs.readdir('./wikis', (err, files) => {
        if (err) {
            console.warn(err);
            store.dispatch(fsError('Error loading meta-data from filesystem'));
        } else {
            console.log('About to parse contained wikis: ', files);
            files.forEach((file) => {
                try {
                    //@ts-ignore
                    store.dispatch(loadWiki(file));
                } catch (e) {
                    console.warn('Error while parsing wiki meta data', e);
                }

            });
        }
    });
}

window.onbeforeunload = () => {
    const wikis = store.getState().wikis;
    wikis.forEach((wiki, index) => {
        if (wiki) {
            fs.writeFile(`./wikis/${wiki.id}/myWiki.config.json`, JSON.stringify(wiki), 'utf8', (err) => {
                if (err) {
                    store.dispatch(fsError('Error saving wiki configuration files'));
                }
            });
        }
    });
}


//@ts-ignore
store.dispatch(parsePlugins());



