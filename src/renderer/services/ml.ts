import Plain from "slate-plain-serializer";
import { Value } from "slate";
import { Article } from "../actions/article";
import ThreadManager, { WorkDistributionStrategy } from "@axc/thread-manager";
import { setArticleKeywords } from "../actions/ml";
import ReduxService from "../../utils/reduxService";
import AppStore, { AppState } from "../store/store";
import { store } from "../app";

export const mlThreads = new ThreadManager(
    './workers/ml.js',
    {
        amountOfWorkers: 1,
        distributionStrategy: WorkDistributionStrategy.ROUND_ROBIN
    }
);

const mlThreadMiddleware = (message: MessageEvent | ErrorEvent, next: Function)=>{
    console.log('Recieved event from the main thread', message);
    //@ts-ignore
    if (message.data && message.data.type === 'GENERATED_KEYWORDS') {
        //@ts-ignore
        store.dispatch(setArticleKeywords(message.data.name, message.data.keywords));
        next();
    }
};
mlThreads.use(mlThreadMiddleware);

