import {PluginMetaData} from "../store/reducers/plugins";


export const isPluginMetaDataValid = (plugin: PluginMetaData)=>{
    return plugin.id && plugin.main && plugin.version && plugin.name;
}