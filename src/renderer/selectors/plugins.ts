import { PluginState, PluginView, PluginMenuAction } from "../store/reducers/plugins";
import { AppState } from "../store/store";




export const isPluginLoaded = (id: string, plugins: PluginState)=>{
    return plugins.find((plugin)=>plugin.id === id && plugin.loaded);
}


export const getPluginViews = (state:AppState)=>{
    const plugins = state.plugins;
    let pluginViews: PluginView[] = [];
    plugins.forEach((plugin)=>{
        console.log(plugin);
        pluginViews = pluginViews.concat(plugin.data.views);
    });
    return pluginViews;
}


export const getPluginMenuActions = (state: AppState)=>{
    const plugins = state.plugins;
    let pluginMenuActions: (PluginMenuAction[])[] = [];
    plugins.forEach((plugin)=>{
        if(plugin.data.menuActions){
            pluginMenuActions.push(plugin.data.menuActions);
        }
    });
    return pluginMenuActions;
}