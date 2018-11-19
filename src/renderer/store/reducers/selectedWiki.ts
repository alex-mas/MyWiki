import { Reducer, AnyAction } from "redux";
import { WikiMetadata } from "./wikis";
import { ArticleMetaData, Article, SAVE_ARTICLE, CREATE_ARTICLE, DELETE_ARTICLE } from "../../actions/article";
import { SELECT_WIKI, SET_WIKI_BACKGROUND, SET_WIKI_NAME, SET_WIKI_DESCRIPTION } from "../../actions/wikis";
import { SET_ARTICLE_KEYWORDS } from "../../actions/ml";
import { SET_SELECTED_WIKI_BACKGROUND, SET_SELECTED_WIKI_DESCRIPTION, SET_SELECTED_WIKI_NAME, UPDATE_SELECTED_WIKI_METADATA } from "../../actions/selectedWiki";




const defaultState: WikiMetadata = {
    name: '',
    id: '',
    articles: [],
    background: '../../../resources/images/radiant.png',
    description: '',
    selected: true
};

export const SelectedWikiReducer: Reducer<WikiMetadata> = (state: WikiMetadata = defaultState, action: AnyAction) => {
    switch (action.type) {
        case SELECT_WIKI:
            return {
                ...action.wiki
            };
        case UPDATE_SELECTED_WIKI_METADATA:
            return{
                ...state,
                ...action.metadata
            }
        case SET_SELECTED_WIKI_BACKGROUND:
            return {
                ...state,
                background: action.background
            }
        case SET_SELECTED_WIKI_DESCRIPTION:
            return {
                ...state,
                background: action.description
            }
        case SET_SELECTED_WIKI_NAME:
            return {
                ...state,
                background: action.name
            }
        case SET_ARTICLE_KEYWORDS:
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

        case SAVE_ARTICLE:
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
        case CREATE_ARTICLE:
            return {
                ...state,
                articles: [...state.articles, action.article]
            }
        case DELETE_ARTICLE:
            return {
                ...state,
                articles: state.articles.filter((article) => article.name !== action.name)
            }
        default:
            return state;
    }
}

export default SelectedWikiReducer;