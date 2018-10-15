import {Plugin} from "../store/reducers/plugins";
import * as fs from 'fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { error, fsError, ErrorAction, ErrorActionCodes } from "./errors";


const loadPlugin = (plugin: Plugin)=>{
    return{
        type: "LOAD_PLUGIN",
        plugin
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