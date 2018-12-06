import { Store, AnyAction, Action } from "redux";
import readOnly from "./readonly";



export class ReduxService<S = any, A extends Action<any> = AnyAction> {
    readonly store: Store<S,A>;
    constructor(store: Store<S,A>){
        this.store = readOnly<Store<S,A>>(store);
    }
    initialize(){
        
    }
}

export default ReduxService;