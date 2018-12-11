import * as EventEmitter from 'events';
import uuid from 'uuid/v4';
import { PluginMetaData } from '../store/reducers/plugins';
import * as path from 'path';
import { store } from '../app';
import { createNotification } from '../actions/notifications';
import AppStore from '../store/store';
import readOnly from '../../utils/readonly';
import { PluginContext, LoadPluginContext, InstallPluginContext } from './pluginContext';



export type Listener = (...args: any[]) => void;


class PluginHooks {
    public id: string;
    private events: EventEmitter;
    constructor(id: string) {
        this.id = id;
        this.events = new EventEmitter();
    }
    addListener = (event: string, listener: (evt: Event) => Promise<void> | EventListener) => {
        if (
            event !== 'install' &&
            event !== 'load'
        ) {
            throw new Error('Plugin attempted to register an unauthorized event');
        }
        this.events.addListener(event, listener);
    }
    emit(event: string, ...args: any[]) {
        this.events.emit(event, ...args);
    }
}






export class PluginManager {
    private plugins: PluginHooks[];
    private readonly store: AppStore;
    constructor(appStore: AppStore) {
        this.plugins = [];
        this.store = readOnly(appStore);
    }

    getPlugin = (id: string) => {
        return this.plugins.find((plugin) => plugin.id === id);
    }
    getPluginContext = () => {
        return {
            notify: (...args: [string, string, string]) => this.store.get().dispatch(createNotification(...args)),
            dispatch: this.store.dispatch,
            getState: this.store.get().getState
        }
    }
    getInstallPluginContext = () => {
        //TODO: add instll only context to the return object
        const pluginContext = this.getPluginContext();
        return pluginContext;
    }
    getLoadPluginContext = () => {
        const pluginContext: any = this.getPluginContext();
        pluginContext.registerReducer = this.store.registerReducer;
        return pluginContext as LoadPluginContext;
    }
    initialize(metaData: PluginMetaData) {
        console.log(path.resolve(`./plugins/${metaData.name}/${metaData.main}`));
        const plugin = eval('require')(path.join(path.resolve('./'), 'plugins', metaData.name, '/', metaData.main));
        const pluginHooks = new PluginHooks(metaData.id);
        plugin(pluginHooks);
        this.plugins.push(pluginHooks);
        return pluginHooks.id;
    }


    install = (id: string) => {
        this.getPlugin(id).emit('install', this.getInstallPluginContext());
    }
    load = (id: string) => {
        this.getPlugin(id).emit('load', this.getLoadPluginContext());
    }

}

