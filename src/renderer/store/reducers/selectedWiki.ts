import { Reducer, AnyAction } from "redux";
import { WikiMetaData } from "./wikis";
import { ArticleMetaData, Article, SAVE_ARTICLE, CREATE_ARTICLE, DELETE_ARTICLE } from "../../actions/article";
import { SELECT_WIKI } from "../../actions/wikis";





const defaultState: WikiMetaData = {
    path: '',
    name: '',
    id: '',
    articles: [],
    background:  '../../../resources/images/radiant.png',
    description: ''
};

export const SelectedWikiReducer: Reducer<WikiMetaData> = (state: WikiMetaData = defaultState, action: AnyAction) => {
    switch (action.type) {
        case SELECT_WIKI:
            return {
                ...action.wiki
            };
        case SAVE_ARTICLE:
            console.log('Saving article: ',state, action.article);
            return {
                ...state,
                articles: state.articles.map((article)=>{
                    if(article.name === action.article.name){
                        return action.article;
                    }else{
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
                articles: state.articles.filter((article)=>article.name !== action.name)
            }
        default:
            return state;
    }
}

export default SelectedWikiReducer;