import { ActionCreator } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import uuid from 'uuid/v4';


export const addWiki: ActionCreator<{wiki: WikiMetaData}> = (name: string,path: string)=>{
    return {
        type: 'ADD_WIKI',
        wiki: {
            path,
            name,
            id: uuid()
        }
    }
}


export const removeWiki: ActionCreator<{id: string}> = (id: string)=>{
    return{
        type: 'REMOVE_WIKI',
        id
    }
}


export default {
    addWiki,
    removeWiki
}