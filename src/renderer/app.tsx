import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as fs from 'fs';
import * as fsp from '../utils/promisify-fs';

require('animate.css/animate.min.css');
require('@axc/react-components/styles/axc-styles.css');
require('./styles/index.scss');



import { Provider, connect } from 'react-redux';
import configureStore, { AppState } from './store/store';

import AppRouter from './router/router';
import { loadWikis, loadWiki, saveWikis } from './actions/wikis';
import { WikiMetadata } from './store/reducers/wikis';
import { fsError } from './actions/errors';
import { parsePlugins, parsePlugin } from './actions/plugins';
import I18String, { I18nSystem as _I18nSystem, I18nSystemProps } from '@axc/react-components/display/i18string';
import { PromptSystem } from '@axc/react-components/interactive/prompt';
import { AnyAction } from 'redux';
import { ThreadManager, WorkDistributionStrategy } from '@axc/thread-manager';
import { AppData } from './store/reducers/appData';
import { setAppData, saveAppData, loadAppData } from './actions/appData';
import { PluginManager } from './plugins/plugins';
import { createNotification, removeNotification } from './actions/notifications';
import initializeMLService from './services/ml';


export const pluginManager = new PluginManager();
export const store = configureStore();
const MLService = initializeMLService(store);

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
    <Provider store={store}>
        <I18nSystem>
            <PromptSystem>
                <AppRouter />
            </PromptSystem>
        </I18nSystem>
    </Provider>
);

ReactDOM.render(App, appRoot);


window.onload = () => {
    //@ts-ignore
    store.dispatch(loadWikis());
    //@ts-ignore
    store.dispatch(loadAppData());

    //@ts-ignore
    store.dispatch(parsePlugins());
    
}

window.onbeforeunload = () => {
    saveWikis();
    saveAppData();
}



export default {
    store
}