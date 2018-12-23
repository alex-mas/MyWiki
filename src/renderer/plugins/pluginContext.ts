import { AnyAction, Reducer } from "redux";
import { AppState } from "../store/store";
import { PluginView, PluginMenuAction } from "../store/reducers/plugins";
import { WikiEditorPlugin } from "../components/wikiEditor/wikiEditor";
import { MemoryHistory } from "history";




export interface PluginContext {
    notify(title: string, description: string, icon: string): void;
    /**
     * Attempts to dispatch a redux action, should be analized to prevent unauthorized actions to be called.
     */
    dispatch(action:AnyAction): any;
    /**
     * 
     * Ideally there should be a permision system so that users can restrict what parts of the state are available to each plugin
     * 
     */ 
    getState():Partial<AppState>;
    getHistory(): MemoryHistory;
}


export interface InstallPluginContext extends PluginContext{
    registerTranslation(): void;
    registerResource():void;
}

export interface LoadPluginContext extends PluginContext {
    /**
     * Adds a new key to the state of the app, so that plugins can have state integrated with the rest of the app state.
     * Return value answers the question: Was the reducer registered on the store?
     */
    registerReducer<T extends any>(key: string, reducer: Reducer<T>): boolean;
    
    registerView(view:PluginView): void;
    /**
     * menu buttons registered by this method will render after app menus and each plugin will have a category with all the buttons
     */
    registerMenuAction(menuButton:PluginMenuAction): void;
    /**
     * Slatejs plugin
     */
    registerEditorPlugin(plugin:WikiEditorPlugin):void;

}