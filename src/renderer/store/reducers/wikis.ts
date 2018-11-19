import { AnyAction, Reducer } from "redux";
import { ArticleMetaData } from "../../actions/article";
import { SET_SELECTED_WIKI_BACKGROUND, SET_SELECTED_WIKI_DESCRIPTION, SET_SELECTED_WIKI_NAME, UPDATE_SELECTED_WIKI_METADATA } from "../../actions/selectedWiki";
import { CREATE_WIKI, LOAD_WIKI, LOAD_WIKIS, REMOVE_WIKI, RESET_WIKI, SET_WIKI_BACKGROUND, SET_WIKI_DESCRIPTION, SET_WIKI_NAME, SELECT_WIKI } from "../../actions/wikis";
import { Omit } from "../../../utils/typeUtils";


export interface WikiMetadata {
    name: string,
    background: string,
    description: string
    id: string,
    articles: ArticleMetaData[],
    selected: boolean
}



export type UserDefinedWikiMetadata = Omit<WikiMetadata, 'selected' | 'id' | 'articles'>
export type WikisMetadataState = WikiMetadata[];

const defaultState: WikisMetadataState = [];


export const WikisMetadataReducer: Reducer<WikisMetadataState> = (state: WikisMetadataState = defaultState, action: AnyAction) => {
    switch (action.type) {
        case UPDATE_SELECTED_WIKI_METADATA:
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
        case SET_SELECTED_WIKI_BACKGROUND:
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
        case SET_SELECTED_WIKI_DESCRIPTION:
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
        case SET_SELECTED_WIKI_NAME:
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
        case SET_WIKI_BACKGROUND:
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
        case SET_WIKI_NAME:
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
        case SET_WIKI_DESCRIPTION:
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
        case CREATE_WIKI:
            return [...state, action.wiki];
        case REMOVE_WIKI:
            return state.filter((wikiMetaData) => wikiMetaData.id !== action.wiki.id);
        case RESET_WIKI:
            return defaultState;
        case LOAD_WIKI:
            return [...state, action.wiki];
        case LOAD_WIKIS:
            return action.wikis;
        case SELECT_WIKI:
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
        default:
            return state;
    }
}

export default WikisMetadataReducer;