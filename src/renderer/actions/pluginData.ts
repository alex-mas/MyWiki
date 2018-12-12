import { PluginMenuButton, PluginView } from "../store/reducers/plugins";
import { WikiEditorPlugin } from "../components/wikiEditor/wikiEditor";


export const REGISTER_EDITOR_PLUGIN = 'REGISTER_EDITOR_PLUGIN';
export const REGISTER_MENU_ACTION = 'REGISTER_MENU_ACTION';
export const REGISTER_PLUGIN_VIEW = 'REGISTER_PLUGIN_VIEW';


export const registerMenuAction = (id: string, menu:PluginMenuButton)=>{
    return{
        type: REGISTER_MENU_ACTION,
        id,
        menu
    }
}

export const registerPluginView = (id:string, view: PluginView)=>{
    return {
        type: REGISTER_PLUGIN_VIEW,
        id,
        view
    }
}

export const registerEditorPlugin = (id:string, plugin: WikiEditorPlugin)=>{
    return {
        type: REGISTER_EDITOR_PLUGIN,
        id,
        plugin
    }
}