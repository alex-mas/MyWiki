import { ActionCreator, Dispatch, Action } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as path from 'path';
import defaultWikiConfig from '../../shared/data/defaultWikiConfig.json';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { error, fsError, ErrorAction, ErrorActionCodes } from "./errors";


type _CreateWikiAction = Action & { wiki: WikiMetaData };

export type CreateWikiActionCreator = (name:string, wikiPath:string) =>ThunkAction<any, AppState, void, _CreateWikiAction | ErrorAction>;

export const createWiki: CreateWikiActionCreator = (name: string) => {
    return (dispatch, getState) => {
        const wikiId = uuid();
        const wikiPath = `./wikis/${name}(${wikiId})`;
        if(!fs.existsSync('./wikis')){
            fs.mkdirSync('./wikis');
        }
        fs.mkdirSync(wikiPath);
        fs.mkdirSync(path.join(wikiPath, 'articles'));
        console.log(path.join(wikiPath,'myWikiConfig.json'));
        fs.writeFile(path.join(wikiPath,'myWikiConfig.json'), JSON.stringify(defaultWikiConfig), 'utf8', (error) => {
            if(error){
                console.log(error);
                dispatch(fsError(`Error creating the configuration file for ${name} wiki`));
            }else{
                dispatch({
                    type: 'CREATE_WIKI',
                    wiki: {
                        path: wikiPath,
                        name,
                        id: wikiId
                    }
                });
                //fs.writeFileSync(path.join(wikiPath, 'home.md'), fs.readFileSync(path.join('./', 'src/static/wikiHome.md')),'utf8');
                //fs.writeFileSync(path.join(wikiPath, 'articles', 'test.md'), fs.readFileSync(path.join('./','src/static/testArticle.md')),'utf8');
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


export type SelectWikiAction = Action & {wiki: WikiMetaData};
export type SelectWikiActionCreator = ActionCreator<ThunkAction<any, AppState, void, SelectWikiAction | ErrorAction>>;

export const selectWiki:SelectWikiActionCreator = (id:string)=>{
    return (dispatch, getState)=>{
        const state = getState();
        const wiki = state.wikis.find((wiki)=>wiki.id === id);
        if(wiki){
            dispatch({
                type: 'SELECT_WIKI',
                wiki
            });
        }else{
            dispatch(error(`Wiki id (${id}) provided doesn't mach with any of the wikis tracked by the app`,ErrorActionCodes.WRONG_PARAMS));
        }
    }

}


export const loadWikis: ActionCreator<{wikis: WikiMetaData[]} & Action> = (wikis: WikiMetaData[])=>{
    return{
        type:'LOAD_WIKIS',
        wikis
    }
}



export default {
    createWiki,
    removeWiki,
    loadWikis
}