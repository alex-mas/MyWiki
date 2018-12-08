import { ActionWithPayload, ACreator } from "../../utils/typeUtils";


export type ALoad = ActionWithPayload<{}>;
export type LoadActionCreator = ACreator<any, ALoad>
export const load = ()=>{
    return{
        type: 'LOAD'
    }
}

export type AUnload = ActionWithPayload<{}>;
export type UnloadActionCreator = ACreator<any, AUnload>
export const unload: UnloadActionCreator = ()=>{
    return{
        type: 'UNLOAD'
    }
}
