import { Reducer, AnyAction } from "redux";
import { WikiMetadata } from "./wikis";
import { ArticleMetaData, Article, SAVE_ARTICLE, CREATE_ARTICLE, DELETE_ARTICLE } from "../../actions/article";
import { SELECT_WIKI, SET_WIKI_BACKGROUND, SET_WIKI_NAME, SET_WIKI_DESCRIPTION, UPDATE_WIKI_METADATA } from "../../actions/wikis";
import { SET_ARTICLE_KEYWORDS } from "../../actions/ml";
import { createReducer } from "../../../utils/reducer";




const defaultState: WikiMetadata = {
    name: '',
    id: '',
    articles: [],
    background: '../../../resources/images/radiant.png',
    description: '',
    selected: true,
    installedPlugins:[],
    group: []
};



export const wikiReducer = createReducer<WikiMetadata>(
    defaultState,
    {
        [SELECT_WIKI]: (state, action)=>{
            if(action.wiki.id === state.id){
                return {
                    ...action.wiki,
                    selected: true
                };
            }else if(state.selected){
                return {
                    ...state,
                    selected:false
                }
            }else{
                return state;
            }
          
        },
        [UPDATE_WIKI_METADATA]: (state, action)=>{
            if(action.wiki.id !== state.id){
                return state;
            }
            return{
                ...state,
                ...action.metadata
            }
        },
        [SET_WIKI_BACKGROUND]: (state, action)=>{
            if(action.wiki.id !== state.id){
                return state;
            }
            return {
                ...state,
                background: action.background
            }
        },
        [SET_WIKI_DESCRIPTION]: (state, action)=>{
            if(action.wiki.id !== state.id){
                return state;
            }
            return {
                ...state,
                background: action.description
            }
        },
        [SET_WIKI_NAME]: (state, action)=>{
            if(action.wiki.id !== state.id){
                return state;
            }
            return {
                ...state,
                background: action.name
            }
        },
        [SET_ARTICLE_KEYWORDS]: (state, action)=>{
            if(action.wiki.id !== state.id){
                return state;
            }
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
            if(action.wiki.id !== state.id){
                return state;
            }
            return {
                ...state,
                articles: state.articles.map((article) => {
                    console.log('updating selected wiki articles from a save', article.name, action.article.name);
                    if (article.name === action.article.name) {
                        return action.article;
                    } else {
                        return article;
                    }
                })
            }
        },
        [CREATE_ARTICLE]: (state, action)=>{
            if(action.wiki.id !== state.id){
                return state;
            }
            return {
                ...state,
                articles: [...state.articles, action.article]
            }
        },
        [DELETE_ARTICLE]: (state, action)=>{
            if(action.wiki.id !== state.id){
                return state;
            }
            return {
                ...state,
                articles: state.articles.filter((article) => article.name !== action.name)
            }
        }
    }
)



export default wikiReducer;