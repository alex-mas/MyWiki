import { ActionWithPayload, ACreator } from "../../utils/typeUtils";
import { WikiMetaData } from "../store/reducers/wikis";


export const SET_CURRENT_WIKI_NAME = 'SET_CURRENT_WIKI_NAME';
export const SET_CURRENT_WIKI_DESCRIPTION = 'SET_CURRENT_WIKI_DESCRIPTION';
export const SET_CURRENT_WIKI_BACKGROUND = 'SET_CURRENT_WIKI_BACKGROUND';
export const UPDATE_CURRENT_WIKI_METADATA = 'UPDATE_CURRENT_WIKI_METADATA';

export type SetCurrentWikiBgAction =ActionWithPayload<{background:string}>;
export type SetCurrentWikiBgActionCreator =ACreator<[string], SetCurrentWikiBgAction>
export const setCurrentWikiBackground: SetCurrentWikiBgActionCreator = (background: string)=>{
    return {
        type: SET_CURRENT_WIKI_BACKGROUND,
        background
    }
}



export type SetCurrentWikiNameAction =ActionWithPayload<{name:string}>;
export type SetCurrentWikiNameActionCreator =ACreator<[string], SetCurrentWikiNameAction>
export const setCurrentWikiName: SetCurrentWikiNameActionCreator = ( name: string)=>{
    return {
        type: SET_CURRENT_WIKI_NAME,
        name
    }
}


export type SetCurrentWikiDescriptionAction =ActionWithPayload<{description: string}>;
export type SetCurrentWikiDescriptionActionCreator =ACreator<[string], SetCurrentWikiDescriptionAction>
export const setCurrentWikiDescription: SetCurrentWikiDescriptionActionCreator = ( description: string)=>{
    return {
        type: SET_CURRENT_WIKI_DESCRIPTION,
        description
    }
}


export type UpdateWikiMetadataPayload ={name:string, description:string, background:string};
export type UpdateCurrentWikiMetadataAction =ActionWithPayload<{metadata: UpdateWikiMetadataPayload}>;
export type UpdateCurrentWikiMetadataActionCreator =ACreator<[UpdateWikiMetadataPayload], UpdateCurrentWikiMetadataAction>
export const updateCurrentWikiMetadata: UpdateCurrentWikiMetadataActionCreator = (metadata: UpdateWikiMetadataPayload)=>{
    return {
        type: UPDATE_CURRENT_WIKI_METADATA,
        metadata
        
    }
}


