import { Reducer, AnyAction } from "redux";
import { ArticleMetaData, SAVE_ARTICLE } from "../../actions/article";
import { CREATE_WIKI, REMOVE_WIKI, LOAD_WIKI, LOAD_WIKIS, RESET_WIKI, SET_WIKI_BACKGROUND, SET_WIKI_NAME, SET_WIKI_DESCRIPTION } from "../../actions/wikis";


export interface WikiMetaData {
    path: string,
    name: string,
    id: string,
    background: string,
    description: string
    articles: ArticleMetaData[]
}

export type WikisMetadataState = WikiMetaData[];

const defaultState: WikisMetadataState = [];


export const WikisMetadataReducer: Reducer<WikisMetadataState> = (state: WikisMetadataState = defaultState, action: AnyAction) => {
    switch (action.type) {
        case SET_WIKI_BACKGROUND:
            return state.map((wikiMetaData) => {
                if (wikiMetaData.id === action.id) {
                    return {
                        ...wikiMetaData,
                        background: action.background
                    };
                }else{
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
                }else{
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
                }else{
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
        default:
            return state;
    }
}

export default WikisMetadataReducer;