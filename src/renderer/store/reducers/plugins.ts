import { Reducer, AnyAction } from "redux";


export interface Plugin {
    id: string

}

export interface PluginMetaData {
    id: string

}

export interface PluginState {
    plugins: PluginMetaData[]
}

const defaultPluginState: PluginState = {
    plugins: []
};

export const pluginReducer: Reducer<PluginState> = (state: PluginState = defaultPluginState, action: AnyAction) => {
    switch (action.type) {
        case "UNLOAD_PLUGIN":
            return {
                ...state,
                plugins: state.plugins.filter((plugin) => plugin.id !== action.id)
            }
        case "LOAD_PLUGIN":
            return{
                ...state,
                plugins:[...state.plugins, action.plugin]
            }
        default:
            return state;
    }
}