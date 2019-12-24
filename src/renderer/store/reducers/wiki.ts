import { AnyAction, Reducer } from "redux";
import { ArticleMetaData } from "../../actions/article";
import { SET_SELECTED_WIKI_BACKGROUND, SET_SELECTED_WIKI_DESCRIPTION, SET_SELECTED_WIKI_NAME, UPDATE_SELECTED_WIKI_METADATA } from "../../actions/selectedWiki";
import { CREATE_WIKI, LOAD_WIKI, LOAD_WIKIS, REMOVE_WIKI, RESET_WIKI, SET_WIKI_BACKGROUND, SET_WIKI_DESCRIPTION, SET_WIKI_NAME, SELECT_WIKI, UPDATE_WIKI_METADATA } from "../../actions/wikis";
import { Omit } from "../../../utils/typeUtils";
import { createReducer } from "../../../utils/reducer";


export interface WikiMetadata {
    name: string,
    background: string,
    description: string
    id: string,
    articles: ArticleMetaData[],
    selected: boolean,
    installedPlugins: String[],
    path?: string
}



export type UserDefinedWikiMetadata = Omit<WikiMetadata, 'selected' | 'id' | 'articles' | 'installedPlugins'>

export type WikiMetadataState = WikiMetadata;

//@ts-ignore
const defaultState: WikiMetadataState = {};

UPDATE_WIKI_METADATA

export const WikisMetadataReducer = createReducer<WikiMetadataState>(
    defaultState,
    {

        [UPDATE_WIKI_METADATA]: (state, action) => {
            if (state.id === action.id) {
                return {
                    ...state,
                    ...action.metadata
                };
            } else {
                return state;
            }

        },
        [SET_WIKI_BACKGROUND]: (state, action) => {
            if (state.id === action.id) {
                return {
                    ...state,
                    background: action.background
                };
            } else {
                return state;
            }

        },
        [SET_WIKI_NAME]: (state, action) => {

            if (state.id === action.id) {
                return {
                    ...state,
                    name: action.name
                };
            } else {
                return state;
            }

        },
        [SET_WIKI_DESCRIPTION]: (state, action) => {
            if (state.id === action.id) {
                return {
                    ...state,
                    description: action.description
                };
            } else {
                return state;
            }

        },

        //actions on a specific wiki -> should be handled by nested reducer
        [SELECT_WIKI]: (state, action) => {
            if (action.wiki.id === state.id) {
                return {
                    ...state,
                    selected: true
                };
            } else {
                return {
                    ...state,
                    selected: false
                };
            }
        }
    }
)

export default WikisMetadataReducer;