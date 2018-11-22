



export type ObservableSubscription<T> = (val: T) => any;
export type Observable<T> = T & {
    subscribe: (changeHandler: ObservableSubscription<T>) => void,
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
        //@ts-ignore because this type is not infered from the bind call
        this.subscriptions = this.subscribtions.filter((subscription) => subscription !== changeHandler);
    }.bind(observableObject);

    observableObject.subscribe = function (changeHandler: ObservableSubscription<T>) {
        //@ts-ignore
        this.subscriptions.push(changeHandler);
        //@ts-ignore
        return ()=>this.unsubscribe(changeHandler);
    }.bind(observableObject);

    return new Proxy(observableObject, {
        set(target, p: string | number, value, receiver) {
            if (p !== 'subscriptions') {
                target[p] = value;
                target.subscriptions.forEach((subscription) => subscription(target));
                return true;
            } else {
                return false;
            }
        }
    });
}


export default makeObservable;