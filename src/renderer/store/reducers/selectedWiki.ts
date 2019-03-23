import { Reducer, AnyAction } from "redux";
import { WikiMetadata } from "./wikis";
import { ArticleMetaData, Article, SAVE_ARTICLE, CREATE_ARTICLE, DELETE_ARTICLE } from "../../actions/article";
import { SELECT_WIKI, SET_WIKI_BACKGROUND, SET_WIKI_NAME, SET_WIKI_DESCRIPTION } from "../../actions/wikis";
import { SET_ARTICLE_KEYWORDS } from "../../actions/ml";
import { SET_SELECTED_WIKI_BACKGROUND, SET_SELECTED_WIKI_DESCRIPTION, SET_SELECTED_WIKI_NAME, UPDATE_SELECTED_WIKI_METADATA } from "../../actions/selectedWiki";
import { createReducer } from "../../../utils/reducer";




const defaultState: WikiMetadata = {
    name: '',
    id: '',
    articles: [],
    background: '../../../resources/images/radiant.png',
    description: '',
    selected: true,
    installedPlugins:[]
};



export const selectedWikiReducer = createReducer<WikiMetadata>(
    defaultState,
    {
        [SELECT_WIKI]: (state, action)=>{
            return {
                ...action.wiki
            };
        },
        [UPDATE_SELECTED_WIKI_METADATA]: (state, action)=>{
            return{
                ...state,
                ...action.metadata
            }
        },
        [SET_SELECTED_WIKI_BACKGROUND]: (state, action)=>{
            return {
                ...state,
                background: action.background
            }
        },
        [SET_SELECTED_WIKI_DESCRIPTION]: (state, action)=>{
            return {
                ...state,
                background: action.description
            }
        },
        [SET_SELECTED_WIKI_NAME]: (state, action)=>{
            return {
                ...state,
                background: action.name
            }
        },
        [SET_ARTICLE_KEYWORDS]: (state, action)=>{
            console.log('setting keywords of', action.article, 'to: ', action.keywords);
            return {
                ...state,
                articles: state.articles.map((article) => {
                    if (article.name === action.article) {
                        return {
                            ...article,
                            keywords: action.keywords
                        }
                    } else {
                        return article;
                    }
                })
            }
        },
        [SAVE_ARTICLE]: (state, action)=>{
            return {
                ...state,
                articles: state.articles.map((article) => {
                    if (article.name === action.article.name) {
                        return action.article;
                    } else {
                        return article;
                    }
                })
            }
        },
        [CREATE_ARTICLE]: (state, action)=>{
            return {
                ...state,
                articles: [...state.articles, action.article]
            }
        },
        [DELETE_ARTICLE]: (state, action)=>{
            return {
                ...state,
                articles: state.articles.filter((article) => article.name !== action.name)
            }
        }
    }
)



export default selectedWikiReducer;