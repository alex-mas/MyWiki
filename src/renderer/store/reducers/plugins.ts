import { Reducer, AnyAction } from "redux";


export interface Plugin {
    id: string

}

export interface PluginMetaData {

}

export interface PluginState {
    plugins: PluginMetaData[],
    loadedPlugins: Plugin[]
}

const defaultPluginState: PluginState = {
    plugins: [],
    loadedPlugins: []
};

export const pluginReducer: Reducer<PluginState> = (state: PluginState = defaultPluginState, action: AnyAction) => {
    switch (action.type) {
        case "UNLOAD_PLUGIN":
            return {
                ...state,
                loadedPlugins: state.loadedPlugins.filter((plugin) => plugin.id !== action.id)
            }
        case "LOAD_PLUGIN":
            return{
                ...state,
                loadedPlugins:[...state.loadedPlugins, action.plugin]
            }
        case "PARSE_PLUGIN":
            return{
                ...state,
                plugins: [...state.plugins, action.plugin]
            }
        default:
            return state;
    }
}