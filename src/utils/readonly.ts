import memoize from './memoize';

export const readOnly = <T extends object>(obj: T)=>{
    return new Proxy(obj,{
        set: function(){
            throw new Error(`${obj.constructor.name} can't be mutated as its readonly`);
        }
    });
}

export default memoize(readOnly as any, 15);