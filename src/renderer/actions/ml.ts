import { mlThreads, store } from "../app";
import Plain from "slate-plain-serializer";
import { Value } from "slate";
import { Article } from "./article";
import { AsyncACreator, ActionWithPayload } from "./utils";
import { ThunkAction } from "redux-thunk";


export const SET_ARTICLE_KEYWORDS = 'SET_ARTICLE_KEYWORDS';



export const generateArticleKeywords = (article: Article)=>{
    mlThreads.sendMessage(
        'GET_KEYWORDS',
        {
            name: article.name,
            contents: Plain.serialize(Value.fromJSON(article.content))
        } 
    );
}

export type SetArticleKeywordsAction = ActionWithPayload<{article:string, keywords: string[]}>;
export type SetArticleKeywordsActionCreator = AsyncACreator<[string, string[]], SetArticleKeywordsAction>;

const setArticleKeywords: SetArticleKeywordsActionCreator= (article: string, keywords: string[]): ThunkAction<any,any,any,any>=>{
    return async(dispatch: any, getState: any)=>{
        dispatch({
            type: SET_ARTICLE_KEYWORDS,
            article,
            keywords
        });
        
    }
 
}



const onRecieveArticleKeywords = (message: MessageEvent, next: Function)=>{
    console.log('Recieved event from the main thread', message);
    if(message.data && message.data.type === 'GENERATED_KEYWORDS'){
        //@ts-ignore
        store.dispatch(setArticleKeywords(message.data.name, message.data.keywords));
        //next();
    }
}


mlThreads.use(onRecieveArticleKeywords);



export default {
    generateArticleKeywords
}