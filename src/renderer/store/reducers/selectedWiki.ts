import { Reducer, AnyAction } from "redux";
import { WikiMetaData } from "./wikis";
import { ArticleMetaData, Article, SAVE_ARTICLE, CREATE_ARTICLE, DELETE_ARTICLE } from "../../actions/article";
import { SELECT_WIKI, SET_WIKI_BACKGROUND, SET_WIKI_NAME, SET_WIKI_DESCRIPTION } from "../../actions/wikis";
import { SET_ARTICLE_KEYWORDS } from "../../actions/ml";
import { SET_CURRENT_WIKI_BACKGROUND, SET_CURRENT_WIKI_DESCRIPTION, SET_CURRENT_WIKI_NAME } from "../../actions/selectedWiki";




const defaultState: WikiMetaData = {
    path: '',
    name: '',
    id: '',
    articles: [],
    background: '../../../resources/images/radiant.png',
    description: ''
};

export const SelectedWikiReducer: Reducer<WikiMetaData> = (state: WikiMetaData = defaultState, action: AnyAction) => {
    switch (action.type) {
        case SELECT_WIKI:
            return {
                ...action.wiki
            };
        case SET_CURRENT_WIKI_BACKGROUND:
            return {
                ...state,
                background: action.background
            }
        case SET_CURRENT_WIKI_DESCRIPTION:
            return {
                ...state,
                background: action.description
            }
        case SET_CURRENT_WIKI_NAME:
            return {
                ...state,
                background: action.name
            }
        case SET_WIKI_BACKGROUND:
            if (action.id === state.id) {
                return {
                    ...state,
                    background: action.background
                }
            } else {
                return state;
            }
        case SET_WIKI_NAME:
            if (action.id === state.id) {
                return {
                    ...state,
                    name: action.name
                }
            } else {
                return state;
            }
        case SET_WIKI_DESCRIPTION:
            if (action.id === state.id) {
                return {
                    ...state,
                    description: action.description
                }
            } else {
                return state;
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