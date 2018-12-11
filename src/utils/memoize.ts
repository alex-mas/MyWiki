export const memoize = <A,R>(fnc:(arg:A)=>R)=>{
    const fncCache = new Map<A,R>();
    return<P extends A = A, RV extends R = R>(arg: P)=>{
        const cached = fncCache.get(arg);
        if(cached){
            return cached as RV;
        }else{
            return fnc(arg) as RV;
        }
    } 
}
export default memoize;