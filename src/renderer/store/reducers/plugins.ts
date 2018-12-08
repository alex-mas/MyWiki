import { Reducer, AnyAction } from "redux";
import { PARSE_PLUGIN, LOAD_PLUGIN, ParsePluginAction } from "../../actions/plugins";
import { createReducer } from "../../../utils/reducer";


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


export const pluginReducer = createReducer<PluginState>(
    defaultPluginState,
    {
        [PARSE_PLUGIN]:(state,action: ParsePluginAction)=>{
            return [...state, action.plugin];
        },
        [LOAD_PLUGIN]:(state,action: ParsePluginAction)=>{
            return state.map((plugin) => {
                if (plugin.id === action.plugin.id) {
                    return {
                        ...plugin,
                        loaded: true
                    }
                } else {
                    return plugin;
                }
            });
        }
    }
);

export default pluginReducer;