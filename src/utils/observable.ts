



export type ObservableSubscription<T> = (val: T) => any;
export type Observable<T> = T & {
    subscribe: (changeHandler: ObservableSubscription<T>) => ObservableSubscription<T>,
    unsubscribe: (changeHandler: ObservableSubscription<T>) => void,
    subscriptions: ObservableSubscription<T>[]
}

export const makeObservable = <T extends {
    [key:string]:any
    [key:number]:any
}>(object: T) => {
    const observableObject = object as Observable<T>;
    observableObject.subscriptions = [];

    observableObject.unsubscribe = function (changeHandler: ObservableSubscription<T>) {
        this.subscriptions = this.subscriptions.filter((subscription) => subscription !== changeHandler);
    }.bind(observableObject);

    observableObject.subscribe = function (changeHandler: ObservableSubscription<T>) {
        this.subscriptions.push(changeHandler);
        return changeHandler;
    }.bind(observableObject);


    return new Proxy(observableObject, {
        set(target, p: string | number, value, receiver) {
            if (p !== 'subscriptions' && p !== 'subscribe' && p !== 'unsubscribe') {
                target[p] = value;
                target.subscriptions.forEach((subscription) => {subscription(target)});
                return true;
            } else {
                return false;
            }
        },
        get(target, p: string | number, receiver){
            if(typeof target[p] === 'function'){
                if(p !== 'subscriptions' && p !== 'subscribe' && p !== 'unsubscribe'){
                    return new Proxy(target[p],{
                        apply(functionTarget, thisArg, argumentsList){
                             const retVal = functionTarget(...argumentsList).bind(thisArg);
                             target.subscriptions.forEach((subscription) => {subscription(target)});
                             return retVal;
                        }
                     })
                }else{
                    return target[p];
                }
            }else{
                return target[p];
            }
        }
    });
}



export default makeObservable;