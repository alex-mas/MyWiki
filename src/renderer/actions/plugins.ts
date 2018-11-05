import {Plugin, PluginMetaData} from "../store/reducers/plugins";
import * as fs from 'fs';
import * as fsp from '../../utils/promisify-fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { fsError, ErrorAction, ErrorActionCodes } from "./errors";
import { isPluginLoaded } from "../selectors/plugins";
import {Action} from 'redux';
import { isPluginMetaDataValid } from "../validators/plugins";
import { settle } from "../utilities/promise";


const _loadPlugin = (plugin: Plugin)=>{
    return{
        type: "LOAD_PLUGIN",
        plugin
    }
}


export const loadPlugin = (pluginMetaData: PluginMetaData)=>{
    return(dispatch:any, getState: any)=>{
        return new Promise(async (resolve,reject)=>{
            const state = getState();
            if(isPluginLoaded(pluginMetaData.id, state.plugins)){
                //dispatch error, plugin cant be loaded twice
            }else{
                //validate meta data -> if its correct load it, else dispatch error
                if(isPluginMetaDataValid(pluginMetaData)){
                    const plugin = eval(`require(plugins/${pluginMetaData.name}/${pluginMetaData.main})`);
                    plugin();
                }
                
            }
        });
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
        type: "UNLOAD_PLUGIN",
        id
    }
}


export const parsePlugin = (pluginMetaData: PluginMetaData) =>{
    return{
        type: 'PARSE_PLUGIN',
        plugin: pluginMetaData
    }
}



export interface ParsePluginAction extends Action {
    plugin: PluginMetaData
}
export type ParsePluginActionCreator = () => ThunkAction<Promise<PluginMetaData[]| ErrorAction>, AppState, void, ParsePluginAction | ErrorAction>;



export const parsePlugins: ParsePluginActionCreator = () =>{
    return(dispatch,getState)=>{
        return (async (): Promise<PluginMetaData[]| ErrorAction>=>{
            try{
                const plugins = await fsp.readdir('./plugins');
                const pluginData= await Promise.all(plugins.map(async(plugin)=>{
                    try{
                        const fileContents = await fsp.readFile(`./plugins/${plugin}/plugin.config.json`, 'utf8');
                        const data: PluginMetaData = JSON.parse(fileContents);
                        data.loaded = false;
                        dispatch(parsePlugin(data));
                        return data;
                    }catch(e){
                        dispatch(fsError(`Error while parsing ${plugin} metadata`));
                        throw e;
                    }
                }));
                return pluginData;
            }catch(e){
                return dispatch(fsError("Error reading plugin directory"));
            }
        })();
    };
}




