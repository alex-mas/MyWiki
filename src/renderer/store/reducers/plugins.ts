import { Reducer, AnyAction } from "redux";
import { PARSE_PLUGIN, LOAD_PLUGIN } from "../../actions/plugins";


export interface Plugin {
    id: string

}

export interface PluginMetaData {
    id: string,
    main: string,
    name: string,
    version: string,
    description: string,
    loaded: boolean
}

export type PluginState = PluginMetaData[];
const defaultPluginState: PluginState = []


export const pluginReducer: Reducer<PluginState> = (state: PluginState = defaultPluginState, action: AnyAction) => {
    switch (action.type) {
        case PARSE_PLUGIN:
            return [...state, action.plugin]
        case LOAD_PLUGIN:
            return state.map((plugin) => {
                if (plugin.id === action.plugin.id) {
                    return {
                        ...plugin,
                        loaded: true
                    }
                } else {
                    return plugin;
                }

            })
        default:
            return state;
    }
}


export default pluginReducer;