import Plain from "slate-plain-serializer";
import { Value } from "slate";
import { Article } from "./article";
import { AsyncACreator, ActionWithPayload } from "../../utils/typeUtils";
import { ThunkAction } from "redux-thunk";
import fsp from '../../utils/promisify-fs';
import {store} from "../app";

export const SET_ARTICLE_KEYWORDS = 'SET_ARTICLE_KEYWORDS';



export type SetArticleKeywordsAction = ActionWithPayload<{article:string, keywords: string[]}>;
export type SetArticleKeywordsActionCreator = AsyncACreator<[string, string[]], SetArticleKeywordsAction>;

export const setArticleKeywords: SetArticleKeywordsActionCreator= (article: string, keywords: string[]) =>{
    return async(dispatch, getState)=>{
        const wiki = getState().selectedWiki.id;
        const filepath = `./wikis/${wiki}/articles/${article}.json`;
        try{
            console.log('about to store new keywords to disk', keywords, filepath);
            const rawArticleData = await fsp.readFile(filepath, 'utf8');
            const articleData: Article = JSON.parse(rawArticleData);
            articleData.keywords = keywords;
            console.log('file to be saved is: ', articleData);
            await fsp.writeFile(filepath,JSON.stringify(articleData), {encoding:'utf8'});
            dispatch({
                type: SET_ARTICLE_KEYWORDS,
                article,
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







