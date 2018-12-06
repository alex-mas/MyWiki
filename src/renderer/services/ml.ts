import Plain from "slate-plain-serializer";
import { Value } from "slate";
import { Article } from "../actions/article";
import ThreadManager, {WorkDistributionStrategy} from "@axc/thread-manager";
import { setArticleKeywords } from "../actions/ml";
import { Store } from "redux";

//TODO: Think of another way to structure this
let ServiceRunner: ThreadManager;


export const generateArticleKeywords = (article: Article)=>{
    if(!ServiceRunner){
        console.warn('attempted to generate article keywords but ml service runner is not initialized');
    }
    ServiceRunner.sendMessage(
        {
            type: 'GET_KEYWORDS',
            name: article.name,
            contents: Plain.serialize(Value.fromJSON(article.content) as any)
        } 
    );
}

export default (store: Store)=>{

    ServiceRunner = new ThreadManager(
        './workers/ml.js',
        {
            amountOfWorkers: 1,
            distributionStrategy: WorkDistributionStrategy.ROUND_ROBIN
        }
    );
 
    const onRecieveArticleKeywords = (message: MessageEvent, next: Function)=>{
        console.log('Recieved event from the main thread', message);
        if(message.data && message.data.type === 'GENERATED_KEYWORDS'){
            console.log('Store inside the callback: ',store);
            //@ts-ignore
            store.dispatch(setArticleKeywords(message.data.name, message.data.keywords));
            next();
        }
    }

    ServiceRunner.use(onRecieveArticleKeywords);

    return ServiceRunner;
}



