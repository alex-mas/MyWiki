import * as EventEmitter from 'events';
import uuid from 'uuid/v4';
import { PluginMetaData } from '../store/reducers/plugins';
import * as path from 'path';
export type Listener = (...args: any[]) => void;


class PluginHooks {
    public id: string;
    public events: EventEmitter;
    constructor(id:string){
        this.id = id;
        this.events = new EventEmitter();  
    }
}






export class Plugins{
    plugins: PluginHooks[];
    constructor(){
        this.plugins = [];
    }

    getPlugin = (id:string)=>{
        return this.plugins.find((plugin)=>plugin.id === id);
    }

    initialize = (metaData: PluginMetaData)=>{
        debugger;
        console.log(path.resolve(`./plugins/${metaData.name}/${metaData.main}`));
        const plugin = eval('require')(path.join(path.resolve('./'),'plugins',metaData.name,'/',metaData.main));
        const pluginHooks = new PluginHooks(metaData.id);
        plugin(pluginHooks.events);
        this.plugins.push(pluginHooks);
        return pluginHooks.id;
    }

    load = (id:string)=>{
        this.getPlugin(id).events.emit('load');
    }

    install = (id:string)=>{
        this.getPlugin(id).events.emit('install');
    }

    unload = (id:string)=>{
        this.getPlugin(id).events.emit('unload');
    }
    uninstall = (id:string)=>{
        this.getPlugin(id).events.emit('uninstall');
    }
    
}

