import { AnyAction, Reducer } from "redux";
import { ArticleMetaData } from "../../actions/article";
import { CREATE_WIKI, LOAD_WIKI, LOAD_WIKIS, REMOVE_WIKI, RESET_WIKI, SET_WIKI_BACKGROUND, SET_WIKI_DESCRIPTION, SET_WIKI_NAME, SELECT_WIKI } from "../../actions/wikis";
import { Omit } from "../../../utils/typeUtils";
import { createReducer } from "../../../utils/reducer";
import {wikiReducer} from './wiki';

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



export type UserDefinedWikiMetadata = Omit<WikiMetadata, 'selected' | 'id' | 'articles' |'installedPlugins'>
export type WikisMetadataState = WikiMetadata[];

const defaultState: WikisMetadataState = [];


export const WikisMetadataReducer = createReducer<WikisMetadataState>(
    defaultState,
    {
        //actions on wiki collection as a whole
        [CREATE_WIKI]:(state,action)=>{
            return [...state, action.wiki];
        },
        [REMOVE_WIKI]:(state,action)=>{
            return state.filter((wikiMetaData) => wikiMetaData.id !== action.wiki.id);
        },
        [LOAD_WIKI]:(state,action)=>{
            return [...state, action.wiki];
        },
        [LOAD_WIKIS]:(state,action)=>{
            return [...state, ...action.wikis];
        },
        default: (state, action)=>{
            return state.map((w)=>{
                return wikiReducer(w,action);
            });
        }
        
    }
)

export default WikisMetadataReducer;