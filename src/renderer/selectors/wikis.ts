import { AppState } from "../store/store";



export const getSelectedWiki = (appState: AppState)=>{
    if(appState.selectedWiki){
        return appState.selectedWiki;
    }else{
        return appState.wikis.find((wiki)=>wiki.selected);
    }
}