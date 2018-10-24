import {Plugin, PluginMetaData} from "../store/reducers/plugins";
import * as fs from 'fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { error, fsError, ErrorAction, ErrorActionCodes } from "./errors";
import { isPluginLoaded } from "../selectors/plugins";
import {Action} from 'redux';


const _loadPlugin = (plugin: Plugin)=>{
    return{
        type: "LOAD_PLUGIN",
        plugin
    }
}


export const loadPlugin = (pluginMetaData: PluginMetaData)=>{
    return(dispatch:any, getState: any)=>{
        const state = getState();
        return new Promise((resolve,reject)=>{
            if(isPluginLoaded(pluginMetaData.id, state.plugins)){
                //dispatch error, plugin cant be loaded twice
            }else{
                //validate meta data -> if its correct load it, else dispatch error
            }
        });
    }
}

export const loadPlugins = ()=>{
    return(dispatch:any, getState:any)=>{
        return new Promise((resolve,reject)=>{
        
        });
    }
}


export const unloadPlugin = (id: string)=>{
    return{
        type: "UNLOAD_PLUGIN",
        id
    }
}


export const parsePlugin = (pluginMetaData: any) =>{
    return{
        type: 'PARSE_PLUGIN',
        plugin: JSON.parse(pluginMetaData)
    }
}



export interface ParsePluginAction extends Action {
    plugin: PluginMetaData
}
export type ParsePluginActionCreator = () => ThunkAction<Promise<string>, AppState, void, ParsePluginAction | ErrorAction>;


export const parsePlugins: ParsePluginActionCreator = () =>{
    return(dispatch,getState)=>{
        return new Promise((resolve,reject)=>{
            fs.readdir("./plugins",(error, plugins)=>{
                if(error){
                    dispatch(fsError("Error reading plugin directory"));
                }else{
                    plugins.forEach((plugin)=>{
                        fs.readFile(`./plugins/${plugin}/plugin.config.json`, 'utf8',(error, pluginMetaData)=>{
                            if(error){
                                dispatch(fsError(`Error while parsing ${plugin} metadata`));
                            }else{
                                dispatch(parsePlugin(pluginMetaData));
                            }
                        });
                    });
                }
            })
        });
    };
}