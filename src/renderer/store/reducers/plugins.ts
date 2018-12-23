import { Reducer, AnyAction } from "redux";
import { PARSE_PLUGIN, LOAD_PLUGIN, ParsePluginAction } from "../../actions/plugins";
import { createReducer } from "../../../utils/reducer";
import { WikiEditorPlugin } from "../../components/wikiEditor/wikiEditor";
import { REGISTER_MENU_ACTION, REGISTER_PLUGIN_VIEW, REGISTER_EDITOR_PLUGIN } from "../../actions/pluginData";


export interface Plugin {
    id: string
}

export interface PluginMenuAction {
    onClick: React.MouseEventHandler<HTMLAnchorElement>,
    icon: string,
    text:string
}

export interface PluginView {
    component: React.ComponentClass<any> | React.SFC<any> | string | any;
    path: string,
    exact:boolean,
    exactParams: boolean
}

export interface PluginMetaData {
    id: string,
    main: string,
    name: string,
    version: string,
    description: string,
    loaded: boolean,
    //TODO: implement actions to add and remove the diferent components of plugin data
    data: {
        menuActions: PluginMenuAction[],
        editorPlugins: WikiEditorPlugin[],
        views: PluginView[]
    }
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
        },
        [REGISTER_MENU_ACTION]: (state, action: any)=>{
            return state.map((plugin)=>{
                if(action.id === plugin.id){
                    const updatedPlugin = {
                        ...plugin
                    }
                    updatedPlugin.data = {
                        ...plugin.data,
                        menuActions:  [...plugin.data.menuActions, action.menuAction]
                    }
                    return updatedPlugin;
                }else{
                    return plugin;
                }
            })
        },
        [REGISTER_PLUGIN_VIEW]: (state, action: any)=>{
            return state.map((plugin)=>{
                if(action.id === plugin.id){
                    const updatedPlugin = {
                        ...plugin
                    }
                    updatedPlugin.data = {
                        ...plugin.data,
                        views:  [...plugin.data.views, action.view]
                    }
                    return updatedPlugin;
                }else{
                    return plugin;
                }
            })
        },
        [REGISTER_EDITOR_PLUGIN]: (state, action: any)=>{
            return state.map((plugin)=>{
                if(action.id === plugin.id){
                    const updatedPlugin = {
                        ...plugin
                    }
                    updatedPlugin.data = {
                        ...plugin.data,
                        editorPlugins:  [...plugin.data.editorPlugins, action.plugin]
                    }
                    return updatedPlugin;
                }else{
                    return plugin;
                }
            })
        }
    }
);

export default pluginReducer;