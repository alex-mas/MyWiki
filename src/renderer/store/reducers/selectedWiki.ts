import { Reducer, AnyAction } from "redux";
import { WikiMetaData } from "./wikis";
import { ArticleMetaData } from "../../actions/article";



export interface SelectedWiki extends WikiMetaData {
    articles: ArticleMetaData[]
}


const defaultState: SelectedWiki = {
    path: '',
    name: '',
    id: '',
    articles: []
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
        default:
            return state;
    }
}

export default SelectedWikiReducer;