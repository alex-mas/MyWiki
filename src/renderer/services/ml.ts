import Plain from "slate-plain-serializer";
import { Value } from "slate";
import { Article } from "../actions/article";
import ThreadManager, { WorkDistributionStrategy } from "@axc/thread-manager";
import { setArticleKeywords } from "../actions/ml";
import { Store } from "redux";
import ReduxService from "../../utils/reduxService";
import AppStore, { AppState } from "../store/store";


export class MLService extends ReduxService<AppState> {
    private serviceRunner: ThreadManager;
    constructor(store: AppStore) {
        super(store.get());
        this.serviceRunner = new ThreadManager(
            './workers/ml.js',
            {
                amountOfWorkers: 1,
                distributionStrategy: WorkDistributionStrategy.ROUND_ROBIN
            }
        );
        this.serviceRunner.use(this.onReceiveArticleKeywords);
    }
    private onReceiveArticleKeywords = (message: MessageEvent, next: Function)=>{
        console.log('Recieved event from the main thread', message);
        if (message.data && message.data.type === 'GENERATED_KEYWORDS') {
            console.log('Store inside the callback: ', this.store);
            //@ts-ignore
            store.dispatch(setArticleKeywords(message.data.name, message.data.keywords));
            next();
        }
    }
    public generateArticleKeywords = (article: Article) => {
        if (!this.serviceRunner) {
            console.warn('attempted to generate article keywords but ml service runner is not initialized');
        }
        this.serviceRunner.sendMessage(
            {
                type: 'GET_KEYWORDS',
                name: article.name,
                contents: Plain.serialize(Value.fromJSON(article.content) as any)
            }
        );
    }
}

export default MLService



