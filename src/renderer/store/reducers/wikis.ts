import { AnyAction, Reducer } from "redux";
import { ArticleMetaData } from "../../actions/article";
import { SET_SELECTED_WIKI_BACKGROUND, SET_SELECTED_WIKI_DESCRIPTION, SET_SELECTED_WIKI_NAME, UPDATE_SELECTED_WIKI_METADATA } from "../../actions/selectedWiki";
import { CREATE_WIKI, LOAD_WIKI, LOAD_WIKIS, REMOVE_WIKI, RESET_WIKI, SET_WIKI_BACKGROUND, SET_WIKI_DESCRIPTION, SET_WIKI_NAME, SELECT_WIKI } from "../../actions/wikis";
import { Omit } from "../../../utils/typeUtils";
import { createReducer } from "../../../utils/reducer";


export interface WikiMetadata {
    name: string,
    background: string,
    description: string
    id: string,
    articles: ArticleMetaData[],
    selected: boolean,
    installedPlugins: String[]
}



export type UserDefinedWikiMetadata = Omit<WikiMetadata, 'selected' | 'id' | 'articles' |'installedPlugins'>
export type WikisMetadataState = WikiMetadata[];

const defaultState: WikisMetadataState = [];


export const WikisMetadataReducer = createReducer<WikisMetadataState>(
    defaultState,
    {
        [UPDATE_SELECTED_WIKI_METADATA]:(state,action)=>{
            return state.map((wikiMetaData) => {
                debugger;
                if (wikiMetaData.selected) {
                    return {
                        ...wikiMetaData,
                        ...action.metadata
                    };
                } else {
                    return wikiMetaData;
                }
            });
        },
        [SET_SELECTED_WIKI_BACKGROUND]:(state,action)=>{
            return state.map((wikiMetaData) => {
                if (wikiMetaData.selected) {
                    return {
                        ...wikiMetaData,
                        background: action.background
                    };
                } else {
                    return wikiMetaData;
                }
            });
        },
        [SET_SELECTED_WIKI_DESCRIPTION]:(state,action)=>{
            return state.map((wikiMetaData) => {
                if (wikiMetaData.selected) {
                    return {
                        ...wikiMetaData,
                        description: action.description
                    };
                } else {
                    return wikiMetaData;
                }
            });
        },
        [SET_SELECTED_WIKI_NAME]:(state,action)=>{
            return state.map((wikiMetaData) => {
                if (wikiMetaData.selected) {
                    return {
                        ...wikiMetaData,
                        name: action.name
                    };
                } else {
                    return wikiMetaData;
                }
            });
        },
        [SET_WIKI_BACKGROUND]:(state,action)=>{
            return state.map((wikiMetaData) => {
                if (wikiMetaData.id === action.id) {
                    return {
                        ...wikiMetaData,
                        background: action.background
                    };
                } else {
                    return wikiMetaData;
                }
            });
        },
        [SET_WIKI_NAME]:(state,action)=>{
            return state.map((wikiMetaData) => {
                if (wikiMetaData.id === action.id) {
                    return {
                        ...wikiMetaData,
                        name: action.name
                    };
                } else {
                    return wikiMetaData;
                }
            });
        },
        [SET_WIKI_DESCRIPTION]:(state,action)=>{
            return state.map((wikiMetaData) => {
                if (wikiMetaData.id === action.id) {
                    return {
                        ...wikiMetaData,
                        description: action.description
                    };
                } else {
                    return wikiMetaData;
                }
            });
        },
        [CREATE_WIKI]:(state,action)=>{
            return [...state, action.wiki];
        },
        [REMOVE_WIKI]:(state,action)=>{
            return state.filter((wikiMetaData) => wikiMetaData.id !== action.wiki.id);
        },
        [RESET_WIKI]:(state,action)=>{
            return defaultState;
        },
        [LOAD_WIKI]:(state,action)=>{
            return [...state, action.wiki];
        },
        [LOAD_WIKIS]:(state,action)=>{
            return action.wikis;
        },
        [SELECT_WIKI]:(state,action)=>{
            return state.map((wiki)=>{
                if(wiki.id === action.wiki.id){
                    return {
                        ...wiki,
                        selected: true
                    }
                }else{
                    return{
                        ...wiki,
                        selected: false
                    }
                }
            })
        }
    }
)

export default WikisMetadataReducer;