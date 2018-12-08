import { AnyAction } from "redux";
import { AppState } from "../store/store";



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
}


export interface InstallPluginContext extends PluginContext{
    registerTranslation(): void;
    registerResource():void;
}

export interface LoadPluginContext extends PluginContext {
    /**
     * Adds a new key to the state of the app, so that plugins can have state integrated with the rest of the app state.
     */
    registerReducer(): void;
    /**
     * View will be accesible via the menu inside the wiki
     */
    registerView(): void;
    /**
     * Slatejs plugin
     */
    registerEditorPlugin():void;

}