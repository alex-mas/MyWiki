import { Reducer, AnyAction } from "redux";
import { WikiMetaData } from "./wikis";
import { ArticleMetaData, Article } from "../../actions/article";



export interface SelectedWiki extends WikiMetaData {
    articles: Article[],
    background: string
}


const defaultState: SelectedWiki = {
    path: '',
    name: '',
    id: '',
    articles: [],
    background:  '../../../resources/images/radiant.png'
};

export const SelectedWikiReducer: Reducer<SelectedWiki> = (state: SelectedWiki = defaultState, action: AnyAction) => {
    switch (action.type) {
        case 'SELECT_WIKI':
            return {
                ...action.wiki
            };
        case 'LOAD_WIKI':
            return {
                ...action.wiki,
                articles: action.articles
            }
        case 'CREATE_ARTICLE':
            return {
                ...state,
                articles: [...state.articles, action.article]
            }
        case 'DELETE_ARTICLE':
            return {
                ...state,
                articles: state.articles.filter((article)=>article.name !== action.name)
            }
        default:
            return state;
    }
}

export default SelectedWikiReducer;