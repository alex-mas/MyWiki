import * as EventEmitter from 'events';
import uuid from 'uuid/v4';
import { PluginMetaData, PluginView, PluginMenuAction } from '../store/reducers/plugins';
import * as path from 'path';
import { store } from '../app';
import { createNotification } from '../actions/notifications';
import AppStore from '../store/store';
import readOnly from '../../utils/readonly';
import { PluginContext, LoadPluginContext, InstallPluginContext } from './pluginContext';
import { registerPluginView, registerMenuAction, registerEditorPlugin } from '../actions/pluginData';
import { WikiEditorPlugin } from '../components/wikiEditor/wikiEditor';
import { appHistory } from '../router/router';



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
    getPluginContext = (id:string) => {
        return {
            notify: (...args: [string, string, string]) => this.store.get().dispatch(createNotification(...args)),
            dispatch: this.store.dispatch,
            getState: this.store.get().getState,
            navigateTo: (path:string, title:string,state:any)=>appHistory.pushState(path)
        }
    }
    getInstallPluginContext = (id: string) => {
        //TODO: add instll only context to the return object
        const pluginContext = this.getPluginContext(id);
        return pluginContext;
    }
    getLoadPluginContext = (id:string) => {
        const pluginContext: any = this.getPluginContext(id);
        pluginContext.registerReducer = this.store.registerReducer;
        pluginContext.registerView = (view: PluginView)=>this.store.get().dispatch(registerPluginView(id,view));
        pluginContext.registerMenuAction = (action:PluginMenuAction)=>this.store.get().dispatch(registerMenuAction(id,action));
        pluginContext.registerEditorPlugin = (plugin: WikiEditorPlugin)=>this.store.get().dispatch(registerEditorPlugin(id, plugin))
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
        this.getPlugin(id).emit('install', this.getInstallPluginContext(id));
    }
    load = (id: string) => {
        this.getPlugin(id).emit('load', this.getLoadPluginContext(id));
    }

}

