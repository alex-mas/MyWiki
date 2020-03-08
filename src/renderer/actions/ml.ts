import Plain from "slate-plain-serializer";
import { Value } from "slate";
import { Article } from "./article";
import { AsyncACreator, ActionWithPayload } from "../../utils/typeUtils";
import { ThunkAction } from "redux-thunk";
import fsp from '../../utils/promisify-fs';
import {store} from "../app";
import { WikiMetadata } from "../store/reducers/wikis";
import { getWikiById } from "../selectors/wikis";

export const SET_ARTICLE_KEYWORDS = 'SET_ARTICLE_KEYWORDS';



export type SetArticleKeywordsAction = ActionWithPayload<{article:string, keywords: string[]}>;
export type SetArticleKeywordsActionCreator = AsyncACreator<[string, string,string[]], SetArticleKeywordsAction>;


export const setArticleKeywords: SetArticleKeywordsActionCreator= (article: string, wikiId: string,keywords: string[]) =>{
    return async(dispatch, getState)=>{
        const filepath = `./wikis/${wikiId}/articles/${article}.json`;
        try{
            console.log('about to store new keywords to disk', keywords, filepath);
            const articleData: Article = JSON.parse(await fsp.readFile(filepath, 'utf8'));
            articleData.keywords = keywords;
            console.log('file to be saved is: ', articleData);
            await fsp.writeFile(filepath,JSON.stringify(articleData), {encoding:'utf8'});
            dispatch({
                type: SET_ARTICLE_KEYWORDS,
                article,
                wiki: getWikiById(getState(),wikiId),
                keywords
            });
        }catch(e){
            throw e;
        }
    }
 
}


export default {
    setArticleKeywords
}







