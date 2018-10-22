import { PluginState } from "../store/reducers/plugins";




export const isPluginLoaded = (id: string, plugins: PluginState)=>{
    return plugins.loadedPlugins.find((plugin)=>plugin.id === id);
}

