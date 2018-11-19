import { ActionWithPayload, ACreator } from "../../utils/typeUtils";
import { WikiMetadata, UserDefinedWikiMetadata } from "../store/reducers/wikis";


export const SET_SELECTED_WIKI_NAME = 'SET_SELECTED_WIKI_NAME';
export const SET_SELECTED_WIKI_DESCRIPTION = 'SET_SELECTED_WIKI_DESCRIPTION';
export const SET_SELECTED_WIKI_BACKGROUND = 'SET_SELECTED_WIKI_BACKGROUND';
export const UPDATE_SELECTED_WIKI_METADATA = 'UPDATE_SELECTED_WIKI_METADATA';

export type SetSelectedWikiBgAction =ActionWithPayload<{background:string}>;
export type SetSelectedWikiBgActionCreator =ACreator<[string], SetSelectedWikiBgAction>
export const setSelectedWikiBackground: SetSelectedWikiBgActionCreator = (background: string)=>{
    return {
        type: SET_SELECTED_WIKI_BACKGROUND,
        background
    }
}



export type SetSelectedWikiNameAction =ActionWithPayload<{name:string}>;
export type SetSelectedWikiNameActionCreator =ACreator<[string], SetSelectedWikiNameAction>
export const setSelectedWikiName: SetSelectedWikiNameActionCreator = ( name: string)=>{
    return {
        type: SET_SELECTED_WIKI_NAME,
        name
    }
}


export type SetSelectedWikiDescriptionAction =ActionWithPayload<{description: string}>;
export type SetSelectedWikiDescriptionActionCreator =ACreator<[string], SetSelectedWikiDescriptionAction>
export const setSelectedWikiDescription: SetSelectedWikiDescriptionActionCreator = ( description: string)=>{
    return {
        type: SET_SELECTED_WIKI_DESCRIPTION,
        description
    }
}


export type UpdateSelectedWikiMetadataAction =ActionWithPayload<{metadata: UserDefinedWikiMetadata}>;
export type UpdateSelectedWikiMetadataActionCreator =ACreator<[UserDefinedWikiMetadata], UpdateSelectedWikiMetadataAction>
export const updateSelectedWikiMetadata: UpdateSelectedWikiMetadataActionCreator = (metadata: UserDefinedWikiMetadata)=>{
    return {
        type: UPDATE_SELECTED_WIKI_METADATA,
        metadata
        
    }
}


