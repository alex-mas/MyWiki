


export const readOnly = <T extends object>(obj: T)=>{
    return new Proxy(obj,{
        set: ()=>{
            throw new Error(`${obj.constructor.name} can't be mutated as its readonly`);
        }
    });
}

export default readOnly;