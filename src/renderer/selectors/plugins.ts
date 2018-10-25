import { PluginState } from "../store/reducers/plugins";




export const isPluginLoaded = (id: string, plugins: PluginState)=>{
    return plugins.find((plugin)=>plugin.id === id && plugin.loaded);
}

