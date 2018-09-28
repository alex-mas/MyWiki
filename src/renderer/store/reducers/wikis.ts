import { Reducer, AnyAction } from "redux";

export interface WikiMetaData{
    path: string,
    name: string,
    id: string
}

export type WikisMetadataState = WikiMetaData[];

const defaultState: WikisMetadataState = [];

export const WikisMetadataReducer: Reducer<WikisMetadataState> = (state: WikisMetadataState = defaultState, action: AnyAction) =>{
    switch(action.type){
        case 'CREATE_WIKI':
            return [...state, action.wiki];
        case 'REMOVE_WIKI':
            return state.filter((wikiMetaData)=>wikiMetaData.id !== action.id);
        case 'RESET_WIKIS':
            return defaultState;
        case 'LOAD_WIKIS':
            return action.wikis;
        default:
            return state;
    }
}

export default WikisMetadataReducer;