import {Plugin, PluginMetaData} from "../store/reducers/plugins";
import * as fs from 'fs';
import * as fsp from '../../utils/promisify-fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { fsError, ErrorAction, ErrorActionCode} from "./errors";
import { isPluginLoaded } from "../selectors/plugins";
import {Action} from 'redux';
import { isPluginMetaDataValid } from "../validators/plugins";
import { settle } from "../../utils/promise";
import { ActionWithPayload, AsyncACreator } from "../../utils/typeUtils";
import { plugins as pluginHooks } from "../app";

export const LOAD_PLUGIN = 'LOAD_PLUGIN';
export const UNLOAD_PLUGIN = 'UNLOAD_PLUGIN';
export const INSTALL_PLUGIN = 'INSTALL_PLUGIN';
export const UNINSTALL_PLUGIN = 'UNINSTALL_PLUGIN';
export const PARSE_PLUGIN = 'PARSE_PLUGIN';


export type LoadPluginAction = ActionWithPayload<{plugin: PluginMetaData}>;
export type LoadPluginActionCreator = AsyncACreator<[PluginMetaData],LoadPluginAction>;

const _loadPlugin = (plugin: PluginMetaData)=>{
    return{
        type: LOAD_PLUGIN,
        plugin
    }
}


export const loadPlugin: LoadPluginActionCreator = (pluginMetaData)=>{
    return async(dispatch:any, getState: any)=>{
        const state = getState();
        if(isPluginLoaded(pluginMetaData.id, state.plugins)){
            //dispatch error, plugin cant be loaded twice
        }else{
            //validate meta data -> if its correct load it, else dispatch error
            if(isPluginMetaDataValid(pluginMetaData)){
                pluginHooks.load(pluginMetaData.id);
                return dispatch(_loadPlugin(pluginMetaData));
            }
            
        }
    }
}

export const loadPlugins = ()=>{
    return(dispatch:any, getState:any)=>{
        return new Promise(async(resolve,reject)=>{
           
        });
    }
}


export const unloadPlugin = (id: string)=>{
    return{
        type: UNLOAD_PLUGIN,
        id
    }
}


export const parsePlugin = (pluginMetaData: PluginMetaData) =>{
    return{
        type: PARSE_PLUGIN,
        plugin: pluginMetaData
    }
}


export interface ParsePluginAction extends Action {
    plugin: PluginMetaData
}
export type ParsePluginActionCreator = () => ThunkAction<Promise<PluginMetaData[]| ErrorAction>, AppState, void, ParsePluginAction | ErrorAction>;


export const parsePlugins: ParsePluginActionCreator = () =>{
    return async(dispatch,getState)=>{
        try{
            const plugins = await fsp.readdir('./plugins');
            const pluginData= await Promise.all(plugins.map(async(plugin)=>{
                try{
                    const fileContents = await fsp.readFile(`./plugins/${plugin}/plugin.config.json`, 'utf8');
                    const data: PluginMetaData = JSON.parse(fileContents);
                    data.loaded = false;
                    debugger;
                    pluginHooks.initialize(data);
                    dispatch(parsePlugin(data));
                    return data;
                }catch(e){
                    dispatch(fsError(`Error while parsing ${plugin} metadata`));
                    throw e;
                }
            }));
            return pluginData;
        }catch(e){
            dispatch(fsError("Error reading plugin directory"));
            throw e;
        }
    };
}




