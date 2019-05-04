import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as fs from 'fs';
import * as fsp from '../utils/promisify-fs';

require('animate.css/animate.min.css');
require('@axc/react-components/styles/axc-styles.css');
require('./styles/index.scss');



import { Provider, connect } from 'react-redux';
import AppStore, { AppState } from './store/store';

import AppRouter from './router/router';
import { loadWikis, loadWiki, saveWikis } from './actions/wikis';
import { WikiMetadata } from './store/reducers/wikis';
import { fsError } from './actions/errors';
import { parsePlugins, parsePlugin } from './actions/plugins';
import I18String, { I18nSystem as _I18nSystem, I18nSystemProps } from '@axc/react-components/i18string';
import { PromptSystem } from '@axc/react-components/prompt';
import { AnyAction } from 'redux';
import { ThreadManager, WorkDistributionStrategy } from '@axc/thread-manager';
import { AppData } from './store/reducers/appData';
import { setAppData, saveAppData, loadAppData, setLocale } from './actions/appData';
import { PluginManager } from './plugins/plugins';
import { createNotification, removeNotification } from './actions/notifications';
import MLService from './services/ml';
import ReduxI18NService from './services/i18n';
import { load, unload } from './actions/appLifecycle';
import { MemoryHistory } from '@axc/react-components/memoryHistory';
import { createMemoryHistory } from 'history';



export const store = new AppStore();
export const pluginManager = new PluginManager(store);
export const mlService = new MLService(store);
export const reduxI18nService = new ReduxI18NService(store);
export const i18n = reduxI18nService.traduce;


const appRoot = document.getElementById('app');



const I18nSystem = connect((state: AppState, props) => {
    return {
        context: {
            locale: state.appData.locale,
            localeData: state.i18n
        }
    }
})(_I18nSystem);


const App = (
    <Provider store={store.get()}>
        <I18nSystem>
            <PromptSystem>
                <AppRouter />
            </PromptSystem>
        </I18nSystem>
    </Provider>
);

ReactDOM.render(App, appRoot);


window.onload = () => {
    store.get().dispatch(load());
    //@ts-ignore
    store.get().dispatch(loadAppData()).then(() => {
        //TODO: refactor this calls into reducer persistors.
        //@ts-ignore
        store.get().dispatch(loadWikis());
        //@ts-ignore
        store.get().dispatch(parsePlugins());
        let currentValue: AppState;
        store.get().subscribe(() => {
            let previousValue = currentValue;
            currentValue = store.get().getState();
            if (previousValue && previousValue.appData && previousValue.appData !== currentValue.appData) {
                saveAppData();
            }
            if (previousValue && previousValue.wikis && previousValue.wikis !== currentValue.wikis) {
                saveWikis();
            }
        })
    });
}

window.onbeforeunload = (e) => {
    store.get().dispatch(unload());
}






export default {
    store
}

