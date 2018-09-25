import { ActionCreator, Dispatch, Action } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as path from 'path';
import defaultWikiConfig from '../../shared/data/defaultWikiConfig.json';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { fsError, ErrorAction } from "./errors";


type _CreateWikiAction = Action & { wiki: WikiMetaData };

export type CreateWikiActionCreator = (name:string, wikiPath:string) =>ThunkAction<any, AppState, void, _CreateWikiAction | ErrorAction>;

export const createWiki: CreateWikiActionCreator = (name: string, wikiPath: string) => {
    return (dispatch, getState) => {
        fs.writeFile(path.join(wikiPath,'myWikiConfig.json'), JSON.stringify(defaultWikiConfig), 'utf8', (error) => {
            if(error){
                dispatch(fsError(`Error creating the configuration file for ${name} wiki`));
            }else{
                dispatch({
                    type: 'CREATE_WIKI',
                    wiki: {
                        path: wikiPath,
                        name,
                        id: uuid()
                    }
                });
            }
        });
    }

}


export const removeWiki: ActionCreator<{ id: string } & Action> = (id: string) => {
    return {
        type: 'REMOVE_WIKI',
        id
    }
}





export default {
    createWiki,
    removeWiki
}