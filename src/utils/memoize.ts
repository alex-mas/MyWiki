export const memoize = <A,R>(fnc:(arg:A)=>R, n: number)=>{
    const fncCache = new Map<A,R>();
    return<P extends A = A, RV extends R = R>(arg: P)=>{
        const cached = fncCache.get(arg);
        if(cached){
            return cached as RV;
        }else{
            const retVal = fnc(arg) as RV;
            if(fncCache.size >= n){
                fncCache.delete(fncCache.keys().next().value);
            }
            fncCache.set(arg, retVal);
            return retVal;
        }
    } 
}
export default memoize;